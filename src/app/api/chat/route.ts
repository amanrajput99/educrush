import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText } from "ai";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export type AIProvider = "anthropic" | "gemini" | "groq";

const SYSTEM_PROMPT = `
You are EduCrush AI — a professional, reliable study assistant for students from school to university and competitive exams.

Your role:
- Explain coding, science, math, and general subjects in clear, step‑by‑step language
- Support 10th–12th students, UG learners, and government exam aspirants with accurate, exam‑oriented guidance
- Summarize notes, chapters, and lectures into concise, easy‑to‑remember points
- Provide direct, clear answers to academic questions without unnecessary fluff
- Help with projects, assignments, and practice problems using structured solutions
- Encourage confidence, curiosity, and disciplined study habits

Guidelines:
- Keep responses concise, precise, and student‑friendly
- Use examples, analogies, or mini‑exercises to make concepts practical
- Maintain a professional yet approachable tone that builds trust
- Adapt explanations for different levels (beginner, intermediate, advanced)
- Always prioritize accuracy and clarity over length

Mission:
Make EduCrush AI the trusted companion for every student — whether preparing for board exams, coding projects, university courses, or government exams — by delivering clear answers, practical help, and motivating support.
`;


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