const PDFDocument = require("pdfkit")

/**
 * Generates a PDF from resume data
 * @param {Object} resumeData - The resume data
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generatePDF(resumeData) {
  return new Promise((resolve, reject) => {
    try {
      // Create a document
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      })

      // Buffer to store PDF
      const buffers = []
      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        resolve(pdfData)
      })

      // Add content based on template
      switch (resumeData.template) {
        case "template2":
          generateTemplate2(doc, resumeData)
          break
        case "template3":
          generateTemplate3(doc, resumeData)
          break
        case "template1":
        default:
          generateTemplate1(doc, resumeData)
          break
      }

      // Finalize PDF
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

// Template 1 - Classic
function generateTemplate1(doc, resumeData) {
  const { personalInfo, education, workExperience, skills, projects, additionalSections } = resumeData

  // Header
  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .text(personalInfo?.fullName || "Your Name", { align: "center" })
  doc.moveDown(0.5)

  // Contact info
  doc.fontSize(10).font("Helvetica")
  const contactInfo = [personalInfo?.email, personalInfo?.phone, personalInfo?.location].filter(Boolean).join(" | ")
  doc.text(contactInfo, { align: "center" })
  doc.moveDown(1)

  // Summary
  if (personalInfo?.summary) {
    doc.fontSize(12).font("Helvetica-Bold").text("PROFESSIONAL SUMMARY")
    doc.moveDown(0.5)
    doc.fontSize(10).font("Helvetica").text(personalInfo.summary)
    doc.moveDown(1)
  }

  // Work Experience
  if (workExperience && workExperience.length > 0) {
    doc.fontSize(12).font("Helvetica-Bold").text("WORK EXPERIENCE")
    doc.moveDown(0.5)

    workExperience.forEach((job) => {
      doc.fontSize(11).font("Helvetica-Bold").text(job.jobTitle)
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`${job.company}, ${job.location || ""}`)
      doc
        .fontSize(9)
        .font("Helvetica-Oblique")
        .text(`${job.startDate} - ${job.currentlyWorking ? "Present" : job.endDate || ""}`)
      doc.moveDown(0.5)

      if (job.description) {
        doc.fontSize(10).font("Helvetica").text(job.description)
        doc.moveDown(0.5)
      }

      if (job.achievements && job.achievements.length > 0) {
        job.achievements.forEach((achievement) => {
          doc.fontSize(10).font("Helvetica").text(`• ${achievement.text}`)
        })
      }

      doc.moveDown(1)
    })
  }

  // Education
  if (education && education.length > 0) {
    doc.fontSize(12).font("Helvetica-Bold").text("EDUCATION")
    doc.moveDown(0.5)

    education.forEach((edu) => {
      doc.fontSize(11).font("Helvetica-Bold").text(`${edu.degree} in ${edu.fieldOfStudy}`)
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`${edu.institution}, ${edu.location || ""}`)
      doc
        .fontSize(9)
        .font("Helvetica-Oblique")
        .text(`${edu.startDate} - ${edu.endDate || ""}`)

      if (edu.description) {
        doc.moveDown(0.5)
        doc.fontSize(10).font("Helvetica").text(edu.description)
      }

      doc.moveDown(1)
    })
  }

  // Skills
  if (skills && skills.length > 0) {
    doc.fontSize(12).font("Helvetica-Bold").text("SKILLS")
    doc.moveDown(0.5)
    doc.fontSize(10).font("Helvetica").text(skills.join(", "))
    doc.moveDown(1)
  }

  // Projects
  if (projects && projects.length > 0) {
    doc.fontSize(12).font("Helvetica-Bold").text("PROJECTS")
    doc.moveDown(0.5)

    projects.forEach((project) => {
      doc.fontSize(11).font("Helvetica-Bold").text(project.title)

      if (project.startDate || project.endDate) {
        doc
          .fontSize(9)
          .font("Helvetica-Oblique")
          .text(`${project.startDate || ""} - ${project.endDate || ""}`)
      }

      doc.moveDown(0.5)
      doc.fontSize(10).font("Helvetica").text(project.description)

      if (project.technologies && project.technologies.length > 0) {
        doc.moveDown(0.5)
        doc
          .fontSize(10)
          .font("Helvetica-Oblique")
          .text(`Technologies: ${project.technologies.join(", ")}`)
      }

      if (project.link) {
        doc.moveDown(0.5)
        doc.fontSize(9).font("Helvetica").text(`Link: ${project.link}`)
      }

      doc.moveDown(1)
    })
  }

  // Additional Sections
  if (additionalSections && additionalSections.length > 0) {
    additionalSections.forEach((section) => {
      doc.fontSize(12).font("Helvetica-Bold").text(section.title.toUpperCase())
      doc.moveDown(0.5)

      if (section.items && section.items.length > 0) {
        section.items.forEach((item) => {
          doc.fontSize(11).font("Helvetica-Bold").text(item.title)
          doc.fontSize(10).font("Helvetica").text(item.content)
          doc.moveDown(0.5)
        })
      }

      doc.moveDown(1)
    })
  }
}

// Template 2 - Modern
function generateTemplate2(doc, resumeData) {
  // Simplified implementation - in a real app, you'd create a more sophisticated template
  generateTemplate1(doc, resumeData)
}

// Template 3 - Minimal
function generateTemplate3(doc, resumeData) {
  // Simplified implementation - in a real app, you'd create a more sophisticated template
  generateTemplate1(doc, resumeData)
}

module.exports = {
  generatePDF,
}
