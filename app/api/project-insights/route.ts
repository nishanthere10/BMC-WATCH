import { NextRequest, NextResponse } from "next/server";
import { getGroq } from "@/lib/groq";
import { GROQ_PROJECT_INSIGHTS_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const { projectData } = await req.json();

    if (!projectData) {
      return NextResponse.json({ error: "Missing projectData" }, { status: 400 });
    }

    const groq = getGroq();

    // Build a clean metadata string for the LLM
    const metadataStr = JSON.stringify(projectData, null, 2);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: GROQ_PROJECT_INSIGHTS_PROMPT },
        {
          role: "user",
          content: `Analyze this BMC infrastructure project and provide insights:\n\n${metadataStr}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const insights = JSON.parse(raw);

    return NextResponse.json(insights);
  } catch (error: unknown) {
    console.error("Project insights error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate insights";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
