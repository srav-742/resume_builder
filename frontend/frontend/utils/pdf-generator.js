import html2canvas from "html2canvas"
import jsPDF from "jspdf"

/**
 * Generate a PDF directly from the resume HTML content with improved layout
 * @param {Object} resumeData - The resume data object
 * @returns {Promise<boolean>} Success status
 */
export async function generatePDF(resumeData) {
  try {
    console.log("Starting optimized PDF generation...")

    // Get the resume content element
    const resumeElement = document.getElementById("resume-content")
    if (!resumeElement) {
      console.error("Resume content element not found")
      throw new Error("Resume content element not found")
    }

    // Create a clone of the element to avoid modifying the original
    const clone = resumeElement.cloneNode(true)

    // Remove any duplicate sections that might be causing issues
    const sectionTitles = new Set()
    clone.querySelectorAll("h2, h3").forEach((heading) => {
      const title = heading.textContent.trim()
      if (sectionTitles.has(title)) {
        // Find the section container and remove it
        let section = heading
        while (section && !section.classList.contains("resume-section") && section.tagName !== "SECTION") {
          section = section.parentElement
        }
        if (section) {
          section.remove()
        }
      } else {
        sectionTitles.add(title)
      }
    })

    // Create a container for the clone
    const containerDiv = document.createElement("div")
    containerDiv.style.position = "absolute"
    containerDiv.style.left = "-9999px"
    containerDiv.style.top = "-9999px"
    containerDiv.style.width = "794px" // A4 width in pixels at 96 DPI
    containerDiv.style.backgroundColor = "white"

    // Apply styles to the clone for better PDF output
    clone.style.width = "100%"
    clone.style.margin = "0"
    clone.style.padding = "20px" // Reduced padding to make content more compact
    clone.style.backgroundColor = "white"
    clone.style.boxSizing = "border-box"
    clone.style.fontSize = "10pt" // Slightly smaller font size for compactness

    // Optimize spacing between sections
    clone.querySelectorAll("section, .resume-section").forEach((section) => {
      section.style.marginBottom = "15px" // Reduce spacing between sections
    })

    // Append the clone to the container
    containerDiv.appendChild(clone)
    document.body.appendChild(containerDiv)

    console.log("Capturing optimized resume content...")

    // Use html2canvas to capture the content as an image
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Remove the clone from the DOM
    document.body.removeChild(containerDiv)

    // Calculate dimensions for A4 page
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const pageMargin = 10 // Margin in mm
    const contentWidth = imgWidth - pageMargin * 2

    // Calculate the scaled height based on content width
    const imgHeight = (canvas.height * contentWidth) / canvas.width

    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}, PDF dimensions: ${contentWidth}x${imgHeight}mm`)

    // Create PDF with compression options for smaller file size
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    // Add the image to the PDF with proper margins
    pdf.addImage(
      canvas,
      "PNG",
      pageMargin, // X position with margin
      pageMargin, // Y position with margin
      contentWidth, // Width with margins on both sides
      imgHeight, // Proportional height
      undefined, // No alias
      "FAST", // Compression
      0, // Rotation
    )

    // Generate filename
    const filename = `${resumeData.personalInfo?.fullName || "resume"}.pdf`.replace(/\s+/g, "_").toLowerCase()
    console.log("Saving optimized PDF with filename:", filename)

    // Save the PDF
    pdf.save(filename)
    console.log("PDF saved successfully")

    return true
  } catch (error) {
    console.error("Error in generatePDF:", error)
    throw error
  }
}

/**
 * Alternative approach using direct rendering with optimized layout
 * @param {Object} resumeData - The resume data object
 * @returns {Promise<boolean>} Success status
 */
export async function generateDirectPDF(resumeData) {
  return new Promise((resolve, reject) => {
    try {
      // Create a hidden iframe to render the resume
      const iframe = document.createElement("iframe")
      iframe.style.width = "0"
      iframe.style.height = "0"
      iframe.style.position = "absolute"
      iframe.style.top = "-9999px"
      iframe.style.left = "-9999px"
      document.body.appendChild(iframe)

      // Get the resume content
      const resumeElement = document.getElementById("resume-content")
      if (!resumeElement) {
        throw new Error("Resume content element not found")
      }

      // Set up the iframe document
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      iframeDoc.open()

      // Create a complete HTML document with necessary styles
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume</title>
          <style>
            @page {
              margin: 10mm;
              size: A4;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: white;
              font-size: 10pt;
            }
            .resume-container {
              padding: 10mm;
              box-sizing: border-box;
            }
            
            /* Optimize layout for PDF */
            h1, h2, h3, h4, h5, h6 {
              margin-top: 10px;
              margin-bottom: 5px;
            }
            p {
              margin-top: 3px;
              margin-bottom: 3px;
            }
            section, .resume-section {
              margin-bottom: 10px;
            }
            
            /* Remove duplicate sections */
            .duplicate-section {
              display: none;
            }
            
            /* Copy all styles from the main document */
            ${Array.from(document.styleSheets)
              .filter((sheet) => {
                try {
                  return sheet.cssRules !== null
                } catch (e) {
                  return false
                }
              })
              .map((sheet) => {
                try {
                  return Array.from(sheet.cssRules)
                    .map((rule) => rule.cssText)
                    .join("\n")
                } catch (e) {
                  return ""
                }
              })
              .join("\n")}
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${resumeElement.outerHTML}
          </div>
          <script>
            // Remove duplicate sections
            const sectionTitles = new Set();
            document.querySelectorAll('h2, h3').forEach(heading => {
              const title = heading.textContent.trim();
              if (sectionTitles.has(title)) {
                // Find the section container and remove it
                let section = heading;
                while (section && !section.classList.contains('resume-section') && section.tagName !== 'SECTION') {
                  section = section.parentElement;
                }
                if (section) {
                  section.remove();
                }
              } else {
                sectionTitles.add(title);
              }
            });
          </script>
        </body>
        </html>
      `)

      iframeDoc.close()

      // Wait for iframe to load
      iframe.onload = () => {
        setTimeout(() => {
          try {
            // Print the iframe content to PDF
            iframe.contentWindow.print()

            // Clean up
            setTimeout(() => {
              document.body.removeChild(iframe)
              resolve(true)
            }, 1000)
          } catch (error) {
            document.body.removeChild(iframe)
            reject(error)
          }
        }, 1000) // Give time for styles to apply
      }
    } catch (error) {
      console.error("Error in generateDirectPDF:", error)
      reject(error)
    }
  })
}

/**
 * Print the resume directly using the browser's print functionality
 * with optimized layout
 */
export function printResume() {
  // Add print-specific styles
  const style = document.createElement("style")
  style.type = "text/css"
  style.id = "print-style"
  style.innerHTML = `
    @media print {
      @page {
        margin: 10mm;
        size: A4;
      }
      body {
        background-color: white !important;
        font-size: 10pt !important;
      }
      .resume-content {
        padding: 0 !important;
      }
      /* Optimize spacing */
      h1, h2, h3, h4, h5, h6 {
        margin-top: 10px !important;
        margin-bottom: 5px !important;
      }
      p {
        margin-top: 3px !important;
        margin-bottom: 3px !important;
      }
      section, .resume-section {
        margin-bottom: 10px !important;
      }
      /* Hide UI elements */
      header, nav, button, .no-print {
        display: none !important;
      }
    }
  `
  document.head.appendChild(style)

  // Remove duplicate sections before printing
  const sectionTitles = new Set()
  const resumeElement = document.getElementById("resume-content")

  if (resumeElement) {
    resumeElement.querySelectorAll("h2, h3").forEach((heading) => {
      const title = heading.textContent.trim()
      if (sectionTitles.has(title)) {
        // Find the section container and add a class to hide it
        let section = heading
        while (section && !section.classList.contains("resume-section") && section.tagName !== "SECTION") {
          section = section.parentElement
        }
        if (section) {
          section.classList.add("duplicate-section")
        }
      } else {
        sectionTitles.add(title)
      }
    })
  }

  // Print
  window.print()

  // Remove the style and restore hidden sections after printing
  setTimeout(() => {
    const printStyle = document.getElementById("print-style")
    if (printStyle) {
      printStyle.remove()
    }

    // Restore hidden sections
    document.querySelectorAll(".duplicate-section").forEach((section) => {
      section.classList.remove("duplicate-section")
    })
  }, 1000)

  return true
}

/**
 * Simple text-based PDF generation (fallback)
 * @param {Object} resumeData - The resume data object
 * @returns {boolean} Success status
 */
export function generateTextPDF(resumeData) {
  try {
    console.log("Generating text version as fallback...")

    // Create a simple text representation of the resume
    const resumeText = `
RESUME

${resumeData.personalInfo?.fullName || ""}
${resumeData.personalInfo?.email || ""}
${resumeData.personalInfo?.phone || ""}
${resumeData.personalInfo?.location || ""}

SUMMARY
${resumeData.personalInfo?.summary || ""}

WORK EXPERIENCE
${
  resumeData.workExperience
    ?.map(
      (job) =>
        `${job.jobTitle} at ${job.company}
${job.startDate} - ${job.currentlyWorking ? "Present" : job.endDate || ""}
${job.description || ""}
${job.achievements?.map((a) => `• ${a.text}`).join("\n") || ""}`,
    )
    .join("\n\n") || ""
}

EDUCATION
${
  resumeData.education
    ?.map(
      (edu) =>
        `${edu.degree} in ${edu.fieldOfStudy}
${edu.institution}${edu.location ? `, ${edu.location}` : ""}
${edu.startDate} - ${edu.endDate || ""}`,
    )
    .join("\n\n") || ""
}

SKILLS
${resumeData.skills?.join(", ") || ""}

PROJECTS
${
  resumeData.projects
    ?.map(
      (project) =>
        `${project.title}
${project.description || ""}
Technologies: ${project.technologies?.join(", ") || ""}
${project.link ? `Link: ${project.link}` : ""}`,
    )
    .join("\n\n") || ""
}
    `

    console.log("Text content generated, creating download...")

    // Create a Blob with the text content
    const blob = new Blob([resumeText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create a link element and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `${resumeData.personalInfo?.fullName || "resume"}.txt`.replace(/\s+/g, "_").toLowerCase()
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url)
      a.remove()
    }, 100)

    console.log("Text download triggered")
    return true
  } catch (error) {
    console.error("Error generating text version:", error)
    throw error
  }
}
