import { NextResponse } from "next/server";
import { createHash } from "crypto"; // ✅ Node built-in — no install needed
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportId, payload } = body;

    if (!reportId || !payload) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Hash the payload using Node's built-in crypto (no external package needed)
    const payloadString = JSON.stringify(payload);
    const reportHash = createHash("sha256").update(payloadString).digest("hex");

    // 2. Check if blockchain config is present
    const privateKey = process.env.THIRDWEB_PRIVATE_KEY;
    const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!privateKey || !clientId || !contractAddress) {
      // Graceful fallback: skip on-chain logging, just return the hash
      console.warn("Blockchain config missing. Skipping on-chain log.");
      return NextResponse.json({
        success: true,
        warning: "Blockchain config missing — on-chain logging skipped.",
        hash: reportHash,
      });
    }

    // 3. Dynamic import of thirdweb (only runs if config is present)
    // This prevents build errors when the package is not installed
    try {
      // @ts-ignore
      const { createThirdwebClient, getContract, prepareContractCall, sendTransaction } = await import("thirdweb");
      // @ts-ignore
      const { polygonAmoy } = await import("thirdweb/chains");
      // @ts-ignore
      const { privateKeyToAccount } = await import("thirdweb/wallets");

      const client = createThirdwebClient({ clientId });
      const account = privateKeyToAccount({ client, privateKey });
      const contract = getContract({ client, chain: polygonAmoy, address: contractAddress });

      const transaction = prepareContractCall({
        contract,
        method: "function logReport(string memory reportId, string memory complaintHash)",
        params: [reportId, reportHash],
      });

      const { transactionHash } = await sendTransaction({ transaction, account });

      // 4. Update Supabase with blockchain verification
      if (transactionHash) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase.from("project_ratings").update({
          blockchain_hash: reportHash,
          blockchain_tx_hash: transactionHash,
          blockchain_verified: true,
        }).eq("id", reportId);
      }

      return NextResponse.json({ success: true, hash: reportHash, txHash: transactionHash });

    } catch (blockchainError: unknown) {
      const msg = blockchainError instanceof Error ? blockchainError.message : "Blockchain execution failed";
      console.error("Blockchain error:", msg);
      // Don't crash the app — return the hash even if blockchain fails
      return NextResponse.json({ success: true, warning: msg, hash: reportHash });
    }

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Execution failed";
    console.error("Log-onchain error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
