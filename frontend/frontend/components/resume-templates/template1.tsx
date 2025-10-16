import type { ResumeData } from "@/context/resume-context"
import { Mail, Phone, MapPin, Link2 } from "lucide-react"

interface ResumeTemplateProps {
  data: ResumeData
}

// Changed from `export function` to `export default function`
export default function ResumeTemplate1({ data }: ResumeTemplateProps) {
  return (
    <div className="bg-white p-8 min-h-[1100px] text-gray-800 font-sans">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.personalInfo?.fullName || "Your Name"}</h1>

        <div className="flex flex-wrap gap-3 text-sm">
          {data.personalInfo?.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}

          {data.personalInfo?.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}

          {data.personalInfo?.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.personalInfo?.summary && (
        <section className="mb-4 resume-section">
          <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1">Professional Summary</h2>
          <p className="text-sm">{data.personalInfo.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* Work Experience */}
          {data.workExperience && data.workExperience.length > 0 && (
            <section className="mb-4 resume-section">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1">Work Experience</h2>
              <div className="space-y-3">
                {data.workExperience.map((job, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-base">{job.jobTitle}</h3>
                        <p className="text-sm">
                          {job.company}
                          {job.location ? `, ${job.location}` : ""}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {job.startDate} - {job.currentlyWorking ? "Present" : job.endDate}
                      </p>
                    </div>
                    {job.description && <p className="text-sm mt-1">{job.description}</p>}

                    {job.achievements && job.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                        {job.achievements.map((achievement, i) => (
                          <li key={i}>{achievement.text}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-4 resume-section">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1">Projects</h2>
              <div className="space-y-3">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-base">{project.title}</h3>
                      {(project.startDate || project.endDate) && (
                        <p className="text-sm text-gray-600">
                          {project.startDate}
                          {project.endDate ? ` - ${project.endDate}` : ""}
                        </p>
                      )}
                    </div>
                    <p className="text-sm mt-1">{project.description}</p>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.link && (
                      <div className="mt-1 text-sm flex items-center">
                        <Link2 className="h-3 w-3 mr-1" />
                        <a
                          href={project.link}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.link}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Publications */}
          {data.additionalSections && data.additionalSections.some((section) => section.type === "publications") && (
            <section className="mb-4 resume-section">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1">Publications</h2>
              {data.additionalSections
                .filter((section) => section.type === "publications")
                .map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-2">
                    {section.items && section.items.length > 0 ? (
                      section.items.map((item, i) => (
                        <div key={i}>
                          <h3 className="font-bold text-sm">{item.title}</h3>
                          <p className="text-sm">{item.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No publications added.</p>
                    )}
                  </div>
                ))}
            </section>
          )}

          {/* Volunteer */}
          {data.additionalSections && data.additionalSections.some((section) => section.type === "volunteer") && (
            <section className="mb-4 resume-section">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1">Volunteer Experience</h2>
              {data.additionalSections
                .filter((section) => section.type === "volunteer")
                .map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-2">
                    {section.items && section.items.length > 0 ? (
                      section.items.map((item, i) => (
                        <div key={i}>
                          <h3 className="font-bold text-sm">{item.title}</h3>
                          <p className="text-sm">{item.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No volunteer experience added.</p>
                    )}
                  </div>
                ))}
            </section>
          )}
        </div>

        <div>
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section className="mb-4 resume-section">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1">Education</h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-sm">
                      {edu.degree} in {edu.fieldOfStudy}
                    </h3>
                    <p className="text-sm">
                      {edu.institution}
                      {edu.location ? `, ${edu.location}` : ""}
                    </p>
                    <p className="text-xs text-gray-600">
                      {edu.startDate}
                      {edu.endDate ? ` - ${edu.endDate}` : ""}
                    </p>
                    {edu.description && <p className="text-xs mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-4 resume-section">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1">Skills</h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.additionalSections && data.additionalSections.some((section) => section.type === "certifications") && (
            <section className="mb-4 resume-section">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1">Certifications</h2>
              {data.additionalSections
                .filter((section) => section.type === "certifications")
                .slice(0, 1) // Only take the first certifications section to avoid duplication
                .map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-2">
                    {section.items && section.items.length > 0 ? (
                      section.items.map((item, i) => (
                        <div key={i}>
                          <h3 className="font-bold text-sm">{item.title}</h3>
                          <p className="text-sm">{item.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No certifications added.</p>
                    )}
                  </div>
                ))}
            </section>
          )}

          {/* Languages */}
          {data.additionalSections && data.additionalSections.some((section) => section.type === "languages") && (
            <section className="mb-4 resume-section">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1">Languages</h2>
              {data.additionalSections
                .filter((section) => section.type === "languages")
                .slice(0, 1) // Only take the first languages section to avoid duplication
                .map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-2">
                    {section.items && section.items.length > 0 ? (
                      section.items.map((item, i) => (
                        <div key={i}>
                          <h3 className="font-bold text-sm">{item.title}</h3>
                          <p className="text-sm">{item.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No languages added.</p>
                    )}
                  </div>
                ))}
            </section>
          )}

          {/* Other Additional Sections */}
          {data.additionalSections &&
            data.additionalSections
              .filter((section) => !["certifications", "languages", "publications", "volunteer"].includes(section.type))
              .map((section, index) => (
                <section key={index} className="mb-4 resume-section">
                  <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1">{section.title}</h2>
                  {section.items && section.items.length > 0 ? (
                    <div className="space-y-2">
                      {section.items.map((item, i) => (
                        <div key={i}>
                          <h3 className="font-bold text-sm">{item.title}</h3>
                          <p className="text-sm">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No items added to this section.</p>
                  )}
                </section>
              ))}
        </div>
      </div>
    </div>
  )
}