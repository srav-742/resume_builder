import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import type { ResumeData } from "@/context/resume-context"

// In-memory storage for demo purposes
// In a real app, you would use a database
let resumeData: ResumeData = {}

export async function GET() {
  try {
    // Get resume data from cookies for persistence
    const storedData = cookies().get("resumeData")?.value

    if (storedData) {
      resumeData = JSON.parse(storedData)
    }

    return NextResponse.json(resumeData)
  } catch (error) {
    console.error("Error fetching resume:", error)
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as ResumeData

    // Update the in-memory data
    resumeData = data

    // Store in cookies for persistence
    cookies().set({
      name: "resumeData",
      value: JSON.stringify(data),
      // 30 days expiry
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error saving resume:", error)
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 })
  }
}
