import type { ResumeData } from "@/context/resume-context"
import { Mail, Phone, MapPin, Link2 } from "lucide-react"

interface ResumeTemplateProps {
  data: ResumeData
}

// Changed from `export function` to `export default function`
export default function ResumeTemplate2({ data }: ResumeTemplateProps) {
  return (
    <div className="bg-white min-h-[1100px] text-gray-800 font-sans flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-blue-800 text-white p-6">
        {/* Profile */}
        <div className="mb-8 text-center">
          {data.personalInfo?.profilePicture && (
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-white">
              <img
                src={data.personalInfo.profilePicture || "/placeholder.svg"}
                alt={data.personalInfo?.fullName || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-xl font-bold mb-1">{data.personalInfo?.fullName || "Your Name"}</h1>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-blue-700 pb-1">Contact</h2>
          <div className="space-y-2">
            {data.personalInfo?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{data.personalInfo.email}</span>
              </div>
            )}

            {data.personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">{data.personalInfo.phone}</span>
              </div>
            )}

            {data.personalInfo?.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{data.personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 border-b border-blue-700 pb-1">Skills</h2>
            <div className="space-y-1">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 border-b border-blue-700 pb-1">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-bold text-sm">{edu.degree}</h3>
                  <p className="text-sm">{edu.fieldOfStudy}</p>
                  <p className="text-sm">{edu.institution}</p>
                  <p className="text-xs opacity-80">
                    {edu.startDate}
                    {edu.endDate ? ` - ${edu.endDate}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Sections that fit in sidebar */}
        {data.additionalSections && data.additionalSections.length > 0 && (
          <>
            {data.additionalSections
              .filter((section) => ["languages", "certifications"].includes(section.type))
              .map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-lg font-bold mb-3 border-b border-blue-700 pb-1">{section.title}</h2>
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
                    <p className="text-sm opacity-80">No items added.</p>
                  )}
                </div>
              ))}
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        {/* Summary */}
        {data.personalInfo?.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 border-b border-gray-300 mb-2 pb-1">Professional Summary</h2>
            <p className="text-sm">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {data.workExperience && data.workExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 border-b border-gray-300 mb-3 pb-1">Work Experience</h2>
            <div className="space-y-4">
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
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
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
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 border-b border-gray-300 mb-3 pb-1">Projects</h2>
            <div className="space-y-4">
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
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
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

        {/* Additional Sections for main content */}
        {data.additionalSections && data.additionalSections.length > 0 && (
          <>
            {data.additionalSections
              .filter((section) => !["languages", "certifications"].includes(section.type))
              .map((section, index) => (
                <section key={index} className="mb-6">
                  <h2 className="text-lg font-bold text-blue-800 border-b border-gray-300 mb-3 pb-1">
                    {section.title}
                  </h2>
                  {section.items && section.items.length > 0 ? (
                    <div className="space-y-3">
                      {section.items.map((item, i) => (
                        <div key={i}>
                          <h3 className="font-bold text-base">{item.title}</h3>
                          <p className="text-sm">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No items added to this section.</p>
                  )}
                </section>
              ))}
          </>
        )}
      </div>
    </div>
  )
}