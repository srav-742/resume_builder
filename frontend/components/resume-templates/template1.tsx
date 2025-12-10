// components/resume-templates/template1.tsx
"use client";

import type { ResumeData } from "@/context/resume-context";

interface ResumeTemplateProps {
  data: ResumeData;
}

export default function ResumeTemplate1({ data }: ResumeTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, additionalSections } = data;

  return (
    <div className="bg-white p-8 min-h-[1100px] text-gray-800 font-sans">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{personalInfo?.fullName || "Full Name"}</h1>

        {/* Contact Info - Inline with dots */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {(personalInfo?.email && personalInfo?.phone) && <span>•</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo?.phone && personalInfo?.website) && <span>•</span>}
          {personalInfo?.website && <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">EDUCATION</h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <h3 className="font-bold text-base">{edu.institution}, {edu.location || 'Location'}</h3>
                  <p className="text-sm italic">{edu.degree}, {edu.fieldOfStudy}</p>
                  {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                </div>
                <div className="text-right text-sm">
                  {edu.startDate} - {edu.endDate || '—'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">PROFESSIONAL EXPERIENCE</h2>
          <div className="space-y-4">
            {workExperience.map((job, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <h3 className="font-bold text-base">{job.company}, {job.location || 'Location'}</h3>
                  <p className="text-sm italic">{job.jobTitle}</p>
                  {job.description && <p className="text-sm mt-1">{job.description}</p>}
                  {job.achievements && job.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      {job.achievements.map((achievement, i) => (
                        <li key={i}>{achievement.text}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="text-right text-sm">
                  {job.startDate} - {job.currentlyWorking ? 'Present' : job.endDate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects & Extracurricular */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">PROJECTS & EXTRACURRICULAR</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <h3 className="font-bold text-base">{project.title}</h3>
                  <p className="text-sm">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right text-sm">
                  {project.startDate} - {project.endDate || '—'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">SKILLS</h2>
          
          {/* Programming Languages */}
          <div className="mb-4">
            <h3 className="font-bold text-base">Programming languages:</h3>
            <p className="text-sm">
              {skills.filter(skill => 
                ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'Rust', 'TypeScript', 'PHP', 'SQL'].some(lang => skill.includes(lang))
              ).join(', ') || 'List programming languages or skills'}
            </p>
          </div>

          {/* Computer Software/Frameworks */}
          <div>
            <h3 className="font-bold text-base">Computer software/frameworks:</h3>
            <p className="text-sm">
              {skills.filter(skill => 
                !['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'Rust', 'TypeScript', 'PHP', 'SQL'].some(lang => skill.includes(lang))
              ).join(', ') || 'Microsoft Office, Adobe Photoshop, Maple, Git, React, jQuery'}
            </p>
          </div>
        </section>
      )}

      {/* Additional Sections */}
      {additionalSections &&
        additionalSections
          .filter((sec) => !["certifications", "languages", "projects"].includes(sec.type))
          .map((sec, idx) => (
            <section key={idx} className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">{sec.title}</h2>
              {sec.items && sec.items.length > 0 ? (
                <div className="space-y-2">
                  {sec.items.map((item, i) => (
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
    </div>
  );
}