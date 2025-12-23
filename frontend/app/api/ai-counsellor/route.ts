import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_SYSTEM_PROMPT } from "@/lib/aiSystemPrompt";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
${AI_SYSTEM_PROMPT}

Analyze the following resume.

Respond ONLY in valid JSON using the required schema.

Resume:
${resumeText}
    `;

    // 🔹 AI CALL
    const result = await model.generateContent(prompt);
    let rawText = result.response.text();

    // 🔹 JSON ENFORCEMENT (THIS IS WHERE YOUR CODE GOES)
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json({
        result: {
          steps: [
            {
              step: "Step 1: Format Error",
              observation: ["AI response was not valid JSON"],
              suggestion: ["Regenerate strictly using the JSON schema"]
            }
          ]
        }
      });
    }

    // 🔹 RETURN CLEAN STRUCTURED RESPONSE
    return NextResponse.json({ result: parsed });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI analysis failed" },
      { status: 500 }
    );
  }
}
