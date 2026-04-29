import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText } from "ai";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export type AIProvider = "anthropic" | "gemini" | "groq";

const SYSTEM_PROMPT = `You are EduCrush AI — a smart, friendly study assistant for students.
You help with:
- Explaining concepts clearly (coding, science, math, etc.)
- Summarizing notes and study material
- Answering academic questions
- Helping with projects and assignments
Keep responses concise, clear, and student-friendly. Use examples when helpful.`;

function getModel(provider: AIProvider) {
  switch (provider) {
    case "anthropic":
      return anthropic("claude-sonnet-4-20250514");
    
case "gemini":
   return google("gemini-2.0-flash");
    case "groq":
      return groq("llama-3.1-8b-instant");
    default:
      return google("gemini-1.5-flash");
  }
}

export async function POST(req: Request) {
  const { messages, provider } = await req.json();
  const aiProvider: AIProvider = provider ?? "gemini";

  const result = await streamText({
    model: getModel(aiProvider),
    system: SYSTEM_PROMPT,
messages: await convertToModelMessages(messages),
  });

return result.toUIMessageStreamResponse();}