"use client";

import type { ResumeData } from "@/context/resume-context";
import { Mail, Phone, MapPin, Link2 } from "lucide-react";

interface ResumeTemplateProps {
  data: ResumeData;
}

export default function ResumeTemplate4({ data }: ResumeTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, additionalSections } = data;

  return (
    <div className="bg-white min-h-[1100px] text-gray-800 font-sans p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-1">{personalInfo?.fullName || "Your Name"}</h1>
        <p className="text-xl font-medium text-gray-600 mb-4">{personalInfo?.jobTitle || "Web Designer"}</p>

        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          {personalInfo?.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo?.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo?.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience Section */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Experience</h2>
          <div className="space-y-6">
            {workExperience.map((job, index) => (
              <div key={index} className="pl-5 border-l-2 border-gray-300">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-lg">{job.jobTitle}</h3>
                    <p className="text-gray-600">{job.company}{job.location ? `, ${job.location}` : ''}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {job.startDate} – {job.currentlyWorking ? 'Present' : job.endDate}
                  </span>
                </div>
                {job.description && <p className="text-gray-700 mb-2">{job.description}</p>}
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
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

      {/* Education Section */}
      {education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Education</h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="pl-5 border-l-2 border-gray-300">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-lg">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.fieldOfStudy}</p>
                    <p className="text-sm text-gray-500">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {edu.startDate} – {edu.endDate || '—'}
                  </span>
                </div>
                {edu.description && <p className="text-gray-700 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Projects</h2>
          <div className="space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="pl-5 border-l-2 border-gray-300">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  {(project.startDate || project.endDate) && (
                    <span className="text-sm text-gray-500">
                      {project.startDate} – {project.endDate || '—'}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-2">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <Link2 className="h-3.5 w-3.5 mr-1" />
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional Sections (Certifications, Languages, etc.) */}
      {additionalSections && additionalSections.length > 0 && (
        <>
          {additionalSections
            .filter((sec) => sec.type === "certifications")
            .map((sec, idx) => (
              <section key={`cert-${idx}`} className="mb-8">
                <h2 className="text-xl font-bold text-blue-700 mb-4">{sec.title || "Certifications"}</h2>
                <div className="space-y-3">
                  {sec.items?.map((item, i) => (
                    <div key={i} className="pl-5 border-l-2 border-gray-300">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

          {additionalSections
            .filter((sec) => sec.type === "languages")
            .map((sec, idx) => (
              <section key={`lang-${idx}`} className="mb-8">
                <h2 className="text-xl font-bold text-blue-700 mb-4">{sec.title || "Languages"}</h2>
                <div className="space-y-3">
                  {sec.items?.map((item, i) => (
                    <div key={i} className="pl-5 border-l-2 border-gray-300">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

          {additionalSections
            .filter((sec) => !["certifications", "languages"].includes(sec.type))
            .map((sec, idx) => (
              <section key={`other-${idx}`} className="mb-8">
                <h2 className="text-xl font-bold text-blue-700 mb-4">{sec.title}</h2>
                <div className="space-y-3">
                  {sec.items?.map((item, i) => (
                    <div key={i} className="pl-5 border-l-2 border-gray-300">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </>
      )}
    </div>
  );
}