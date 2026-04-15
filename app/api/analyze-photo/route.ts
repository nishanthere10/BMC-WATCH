import { NextResponse } from "next/server";
import { getGroq } from "@/lib/groq";
import { GROQ_SITE_AUDITOR_PROMPT } from "@/lib/prompts";
import { AnalyzePhotoSchema } from "@/lib/schemas";

// Simple in-memory rate limiter (per-instance; use Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per window

// Allowed image URL origins
const ALLOWED_IMAGE_HOSTS = [
  "wfgyxzawetyqoawsgbkg.supabase.co",
];

function isAllowedImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_IMAGE_HOSTS.some((host) => parsed.hostname === host);
  } catch {
    return false;
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(req: Request) {
  try {
    // Rate limiting by IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = AnalyzePhotoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { imageUrl } = validation.data;

    // SSRF protection: only allow images from our Supabase storage
    if (!isAllowedImageUrl(imageUrl)) {
      return NextResponse.json(
        { error: "Image URL must be from the BMC Watch storage bucket." },
        { status: 403 }
      );
    }

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("AI Analysis error:", message);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}