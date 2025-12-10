// components/resume-templates/template6.tsx
"use client";

import type { ResumeData } from "@/context/resume-context";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Trophy, BookOpen, Languages, Link2 } from "lucide-react";

interface ResumeTemplate6Props {
  data: ResumeData;
}

export default function ResumeTemplate6({ data }: ResumeTemplate6Props) {
  const { personalInfo, workExperience, education, skills, projects, additionalSections } = data;

  // Helper to render section with pink header and underline
  const Section = ({ 
    title, 
    children,
    icon: Icon
  }: { 
    title: string;
    children: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <section className="mb-6">
      <div className="flex items-center mb-3">
        {Icon && <Icon className="h-5 w-5 text-pink-500 mr-2" />}
        <h2 className="text-xl font-bold text-pink-600 pb-1 border-b-2 border-pink-300">{title}</h2>
      </div>
      {children}
    </section>
  );

  return (
    <div className="bg-white min-h-[1100px] text-gray-800 font-sans p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header: Name + Contact */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-1">
          {personalInfo?.fullName || "Your Name"}
        </h1>
        <p className="text-lg text-gray-600 italic mb-4">
          {personalInfo?.jobTitle || "Senior Data Analyst"}
        </p>

        {/* Contact Info - Right Aligned on Desktop */}
        <div className="flex flex-wrap justify-between md:justify-end gap-4 text-sm text-gray-600">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {personalInfo?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1 text-pink-500" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1 text-pink-500" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-pink-500" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {personalInfo?.summary && (
        <Section title="SUMMARY">
          <p className="leading-relaxed text-gray-700">{personalInfo.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {workExperience && workExperience.length > 0 && (
        <Section title="EXPERIENCE">
          <div className="space-y-5">
            {workExperience.map((job, index) => (
              <div key={index} className="pl-4 border-l-2 border-pink-200">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{job.jobTitle}</h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {job.startDate} – {job.currentlyWorking ? 'Present' : job.endDate}
                  </span>
                </div>
                {job.location && <p className="text-sm text-gray-500 italic">{job.location}</p>}
                {job.description && <p className="text-gray-700 mt-2">{job.description}</p>}
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="list-disc list-outside pl-5 mt-2 space-y-1 text-gray-700">
                    {job.achievements.map((a, i) => (
                      <li key={i}>{a.text}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <Section title="EDUCATION">
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="pl-4 border-l-2 border-pink-200">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.fieldOfStudy}</p>
                    <p className="text-sm text-gray-500">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500 mt-1 md:mt-0">
                    {edu.startDate} – {edu.endDate || '—'}
                  </span>
                </div>
                {edu.location && <p className="text-sm text-gray-500 italic mt-1">{edu.location}</p>}
                {edu.description && <p className="text-gray-700 mt-2">{edu.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <Section title="SKILLS">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <Section title="PROJECTS">
          <div className="space-y-5">
            {projects.map((project, index) => (
              <div key={index} className="pl-4 border-l-2 border-pink-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
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
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
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
                    className="inline-flex items-center text-pink-600 hover:text-pink-800 text-sm font-medium"
                  >
                    <Link2 className="h-3 w-3 mr-1" />
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Additional Sections */}
      {additionalSections && (
        <>
          {additionalSections.some(sec => sec.type === 'certifications') && (
            <Section title="CERTIFICATION">
              <div className="space-y-3">
                {additionalSections
                  .filter(sec => sec.type === 'certifications')
                  .flatMap(sec => sec.items || [])
                  .map((item, i) => (
                    <div key={i}>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.content}</p>
                    </div>
                  ))}
              </div>
            </Section>
          )}

          {additionalSections.some(sec => sec.type === 'languages') && (
            <Section title="LANGUAGES">
              <div className="space-y-2">
                {additionalSections
                  .filter(sec => sec.type === 'languages')
                  .flatMap(sec => sec.items || [])
                  .map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{item.title}</span>
                      <span className="text-gray-600">{item.content}</span>
                    </div>
                  ))}
              </div>
            </Section>
          )}
        </>
      )}
    </div>
  );
}