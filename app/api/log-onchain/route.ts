import { NextResponse } from "next/server";
import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
import SHA256 from "crypto-js/sha256";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportId, payload } = body;

    if (!reportId || !payload) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Hash the simple payload
    const payloadString = JSON.stringify(payload);
    const reportHash = SHA256(payloadString).toString();

    // 2. Fallback check for Environment Variables
    const privateKey = process.env.THIRDWEB_PRIVATE_KEY;
    const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!privateKey || !clientId || !contractAddress) {
      console.warn("Blockchain config missing. Skipping on-chain log.");
      return NextResponse.json({ 
        success: true, 
        warning: "Blockchain config missing",
        hash: reportHash
      });
    }

    // 3. Initialize Thirdweb v5 Server Client
    const client = createThirdwebClient({
      clientId: clientId,
    });

    const account = privateKeyToAccount({ client, privateKey });

    const contract = getContract({
      client,
      chain: polygonAmoy,
      address: contractAddress,
    });

    // 4. Prepare and Send Transaction
    const transaction = prepareContractCall({
      contract,
      method: "function logReport(string memory reportId, string memory complaintHash)",
      params: [reportId, reportHash],
    });

    const { transactionHash } = await sendTransaction({
      transaction,
      account,
    });

    // 5. Update Supabase with Blockchain verification (Server-Side for reliability)
    if (transactionHash) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from("project_ratings").update({
        blockchain_hash: reportHash,
        blockchain_tx_hash: transactionHash,
        blockchain_verified: true
      }).eq("id", reportId);
    }

    return NextResponse.json({ 
      success: true, 
      hash: reportHash, 
      txHash: transactionHash 
    });

  } catch (error: any) {
    console.error("Blockchain execution error", error);
    return NextResponse.json({ error: error.message || "Execution failed" }, { status: 500 });
  }
}
