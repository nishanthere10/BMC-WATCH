import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { GROQ_SMART_DOCTOR_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: GROQ_SMART_DOCTOR_PROMPT },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Low temperature for consistent diagnosis
    });

    const diagnosis = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json({ success: true, analysis: diagnosis });
  } catch (error) {
    return NextResponse.json({ error: "Diagnosis failed" }, { status: 500 });
  }
}