import { NextResponse } from "next/server";
import { getGroq } from "@/lib/groq";
import { GROQ_SITE_AUDITOR_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    const completion = await getGroq().chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: GROQ_SITE_AUDITOR_PROMPT },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error("AI Analysis error:", error?.message);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}