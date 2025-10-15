import type { ResumeData } from "@/context/resume-context"
import { Mail, Phone, MapPin, Link2 } from "lucide-react"

interface ResumeTemplateProps {
   ResumeData
}

// Changed from `export function` to `export default function`
export default function ResumeTemplate3({ data }: ResumeTemplateProps) {
  return (
    <div className="bg-white min-h-[1100px] text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">{data.personalInfo?.fullName || "Your Name"}</h1>

        <div className="flex flex-wrap gap-4 text-sm">
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

      <div className="p-8">
        {/* Summary */}
        {data.personalInfo?.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Professional Summary</h2>
            <div className="border-l-4 border-gray-900 pl-4">
              <p>{data.personalInfo.summary}</p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Work Experience */}
            {data.workExperience && data.workExperience.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>
                <div className="space-y-6">
                  {data.workExperience.map((job, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start flex-wrap">
                        <div>
                          <h3 className="font-bold text-lg">{job.jobTitle}</h3>
                          <p className="text-gray-600">
                            {job.company}
                            {job.location ? `, ${job.location}` : ""}
                          </p>
                        </div>
                        <p className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {job.startDate} - {job.currentlyWorking ? "Present" : job.endDate}
                        </p>
                      </div>
                      {job.description && <p className="mt-2">{job.description}</p>}

                      {job.achievements && job.achievements.length > 0 && (
                        <ul className="list-disc list-inside mt-2 space-y-1">
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
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Projects</h2>
                <div className="space-y-6">
                  {data.projects.map((project, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start flex-wrap">
                        <h3 className="font-bold text-lg">{project.title}</h3>
                        {(project.startDate || project.endDate) && (
                          <p className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {project.startDate}
                            {project.endDate ? ` - ${project.endDate}` : ""}
                          </p>
                        )}
                      </div>
                      <p className="mt-2">{project.description}</p>

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {project.link && (
                        <div className="mt-2 flex items-center">
                          <Link2 className="h-4 w-4 mr-1" />
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

            {/* Additional Sections for main column */}
            {data.additionalSections && data.additionalSections.length > 0 && (
              <>
                {data.additionalSections
                  .filter((section) => !["languages", "certifications", "skills"].includes(section.type))
                  .map((section, index) => (
                    <section key={index}>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                      {section.items && section.items.length > 0 ? (
                        <div className="space-y-4">
                          {section.items.map((item, i) => (
                            <div key={i} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                              <h3 className="font-bold text-lg">{item.title}</h3>
                              <p>{item.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No items added to this section.</p>
                      )}
                    </section>
                  ))}
              </>
            )}
          </div>

          <div className="space-y-8">
            {/* Education */}
            {data.education && data.education.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-gray-200 pl-4">
                      <h3 className="font-bold">{edu.degree}</h3>
                      <p>{edu.fieldOfStudy}</p>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startDate}
                        {edu.endDate ? ` - ${edu.endDate}` : ""}
                      </p>
                      {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Additional Sections for sidebar */}
            {data.additionalSections && data.additionalSections.length > 0 && (
              <>
                {data.additionalSections
                  .filter((section) => ["languages", "certifications"].includes(section.type))
                  .map((section, index) => (
                    <section key={index}>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                      {section.items && section.items.length > 0 ? (
                        <div className="space-y-3">
                          {section.items.map((item, i) => (
                            <div key={i} className="border-l-4 border-gray-200 pl-4">
                              <h3 className="font-bold">{item.title}</h3>
                              <p className="text-sm">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No items added.</p>
                      )}
                    </section>
                  ))}

                {data.additionalSections && data.additionalSections.length > 0 && (
                  <>
                    {data.additionalSections.map((section, index) => (
                      <section key={index}>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                        {section.items && section.items.length > 0 ? (
                          <div className="space-y-4">
                            {section.items.map((item, i) => (
                              <div key={i} className="border-l-4 border-gray-200 pl-4">
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="text-sm">{item.content}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No items added to this section.</p>
                        )}
                      </section>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}