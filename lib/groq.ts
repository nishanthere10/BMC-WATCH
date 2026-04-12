import Groq from "groq-sdk";

let _groq: Groq | null = null;

export function getGroq(): Groq {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY in environment variables.");
    }
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}