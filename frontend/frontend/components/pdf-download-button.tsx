"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Download, Printer } from "lucide-react"
import { generatePDF, generateDirectPDF, printResume } from "@/utils/pdf-generator"
import { useResume } from "@/context/resume-context"

export function PdfDownloadButton(): JSX.Element {
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const { toast } = useToast()
  const { resumeData } = useResume()

  async function handleDownload(): Promise<void> {
    setIsDownloading(true)
    console.log("Starting optimized PDF download process...")

    try {
      // Try the improved HTML-to-PDF approach
      const success = await generatePDF(resumeData)

      if (success) {
        console.log("PDF generated successfully with optimized layout")
        toast({
          title: "Success",
          description: "Your resume has been downloaded with improved formatting",
        })
      } else {
        throw new Error("PDF generation failed")
      }
    } catch (error) {
      console.error("Error generating PDF:", error)

      // Try the direct PDF approach as fallback
      toast({
        variant: "destructive",
        title: "PDF Generation Failed",
        description: "Trying alternative method...",
      })

      try {
        await generateDirectPDF(resumeData)
        toast({
          title: "Success",
          description: "Your resume has been downloaded using the alternative method",
        })
      } catch (fallbackError) {
        console.error("Fallback method also failed:", fallbackError)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate PDF. Please try the print option instead.",
        })
      }
    } finally {
      setIsDownloading(false)
    }
  }

  function handlePrint(): void {
    printResume()
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleDownload} disabled={isDownloading}>
        <Download className="mr-2 h-4 w-4" />
        {isDownloading ? "Downloading..." : "Download PDF"}
      </Button>
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print to PDF
      </Button>
    </div>
  )
}
