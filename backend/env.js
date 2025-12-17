import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(" GEMINI_API_KEY is missing. Check .env placement.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function callGemini(prompt) {
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});



  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Gemini returned invalid JSON");

  return JSON.parse(match[0]);
}