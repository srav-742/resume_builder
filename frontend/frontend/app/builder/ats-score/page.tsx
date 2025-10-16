"use client"

import { useState, useEffect } from "react" // 👈 Added useEffect
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useResume } from "@/context/resume-context" // 👈 Already imported
import { analyzeResume } from "@/services/api"
import { BuilderNavigation } from "@/components/builder-navigation"
import { FormSkeleton } from "@/components/form-skeleton"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function ATSScorePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, resumeData, isLoading } = useResume() // 👈 Destructure `user`
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    score: number
    matchedKeywords: string[]
    missingKeywords: string[]
    recommendations: string[]
  } | null>(null)

  // 👇 Added: Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <FormSkeleton />
  }

  async function handleAnalyze() {
    if (!jobDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a job description to analyze",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      const result = await analyzeResume(resumeData, jobDescription)
      setAnalysisResult(result)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze your resume. Please try again.",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  function getScoreText(score: number) {
    if (score >= 80) return "Excellent match!"
    if (score >= 60) return "Good match"
    return "Needs improvement"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Score</CardTitle>
        <CardDescription>Check how well your resume matches the job description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="job-description" className="text-sm font-medium">
              Job Description
            </label>
            <Textarea
              id="job-description"
              placeholder="We are looking for a skilled Software Engineer with experience in React, Node.js, and TypeScript to join our team."
              className="min-h-[200px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Paste the full job description to get the most accurate analysis
            </p>
          </div>

          <Button onClick={handleAnalyze} disabled={isAnalyzing || !jobDescription.trim()} className="w-full">
            {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
          </Button>

          {analysisResult && (
            <div className="space-y-6 mt-8 p-6 border rounded-lg">
              <div className="space-y-2 text-center">
                <div className={`text-5xl font-bold ${getScoreColor(analysisResult.score)}`}>
                  {analysisResult.score}
                </div>
                <Progress value={analysisResult.score} className="h-2 w-full max-w-md mx-auto" />
                <p className={`font-medium ${getScoreColor(analysisResult.score)}`}>
                  {getScoreText(analysisResult.score)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {analysisResult.score >= 80
                    ? "Your resume is well-optimized for this job."
                    : "Consider updating your resume based on the recommendations below."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                    Matched Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.matchedKeywords?.length ? (
                      analysisResult.matchedKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {keyword}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No matching keywords found.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingKeywords?.length ? (
                      analysisResult.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {keyword}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No missing keywords found.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  {analysisResult.recommendations?.length ? (
                    <ul className="space-y-2 list-disc pl-5">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm">
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recommendations at this time.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <BuilderNavigation>
            <Button type="button" variant="outline" onClick={() => router.push("/builder/additional-sections")}>
              Previous
            </Button>
            <Button onClick={() => router.push("/preview?from=ats-score")}>Finish</Button>
          </BuilderNavigation>
        </div>
      </CardContent>
    </Card>
  )
}