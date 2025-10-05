import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileText } from "lucide-react"
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper"

export default function Home() {
  return (
    <ThemeProviderWrapper>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center bg-primary text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold">Resume Builder</CardTitle>
              <CardDescription className="text-primary-foreground">
                Create a professional resume in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex justify-center">
                  <FileText size={64} className="text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-center">Build Your Professional Resume</h2>
                <p className="text-center text-muted-foreground max-w-lg">
                  Our easy-to-use resume builder helps you create a personalized, professional resume that will impress
                  employers.
                </p>
                <Link href="/templates" className="w-full max-w-xs">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </Link>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <h3 className="font-medium">Professional Templates</h3>
                    <p className="text-sm text-muted-foreground">Choose from professionally designed templates</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </div>
                    <h3 className="font-medium">Easy to Customize</h3>
                    <p className="text-sm text-muted-foreground">Personalize your resume with our intuitive editor</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h3 className="font-medium">ATS-Friendly</h3>
                    <p className="text-sm text-muted-foreground">Optimize your resume to pass ATS systems</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProviderWrapper>
  )
}
