"use client";

import type { ResumeData } from "@/context/resume-context";
import { Mail, Phone, MapPin, Link2 } from "lucide-react";

interface ResumeTemplate6Props {
  data: ResumeData;
}

export default function ResumeTemplate6({ data }: ResumeTemplate6Props) {
  const { personalInfo, workExperience, education, skills, projects, additionalSections } = data;

  const Section = ({
    title,
    children,
    icon: Icon
  }: {
    title: string;
    children: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <section className="mb-4 md:mb-6">
      <div className="flex items-center mb-2 md:mb-3">
        {Icon && <Icon className="h-4 w-4 md:h-5 md:w-5 text-pink-500 mr-2" />}
        <h2 className="text-lg md:text-xl font-bold text-pink-600 pb-1 border-b-2 border-pink-300 w-full">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );

  return (
    <div
      className="
        bg-white 
        min-h-[1100px]
        w-full
        text-gray-800 
        font-sans 
        p-6
        break-words 
        leading-normal
        resume-template
      "
    >
      {/* Inner container to maintain readable content width */}
      <div className="max-w-[720px] mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8 border-b pb-4 border-pink-100">
          <h1 className="text-2xl md:text-4xl font-bold text-pink-600 mb-1 break-words">
            {personalInfo?.fullName || "Your Name"}
          </h1>
          <p className="text-sm md:text-lg text-gray-600 italic mb-3 break-words">
            {personalInfo?.jobTitle || "Senior Data Analyst"}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs md:text-sm text-gray-600">
            {personalInfo?.email && (
              <div className="flex items-center break-all">
                <Mail className="h-3 w-3 md:h-4 md:w-4 mr-1 text-pink-500" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1 text-pink-500" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 text-pink-500" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </header>

        {/* Summary */}
        {personalInfo?.summary && (
          <Section title="SUMMARY">
            <p className="text-xs md:text-base text-gray-700 leading-relaxed text-justify break-words">
              {personalInfo.summary}
            </p>
          </Section>
        )}

        {/* Experience */}
        {workExperience && workExperience.length > 0 && (
          <Section title="EXPERIENCE">
            <div className="space-y-4 md:space-y-5">
              {workExperience.map((job, index) => (
                <div key={index} className="pl-3 md:pl-4 border-l-2 border-pink-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm md:text-lg text-gray-900 break-words">
                        {job.jobTitle}
                      </h3>
                      <p className="text-xs md:text-base text-gray-600 font-medium break-words">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                      {job.startDate} – {job.currentlyWorking ? "Present" : job.endDate}
                    </span>
                  </div>

                  {job.location && (
                    <p className="text-xs text-gray-500 italic mb-1 break-words">{job.location}</p>
                  )}

                  {job.description && (
                    <p className="text-xs md:text-base text-gray-700 mt-1 text-justify break-words">
                      {job.description}
                    </p>
                  )}

                  {job.achievements && job.achievements.length > 0 && (
                    <ul className="list-disc list-outside pl-4 mt-2 space-y-1 text-gray-700 text-xs md:text-base break-words">
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
            <div className="space-y-3 md:space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="pl-3 md:pl-4 border-l-2 border-pink-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm md:text-base text-gray-900 break-words">
                        {edu.degree}
                      </h3>
                      <p className="text-xs md:text-base text-gray-600 break-words">{edu.fieldOfStudy}</p>
                      <p className="text-xs text-gray-500 break-words">{edu.institution}</p>
                    </div>
                    <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                      {edu.startDate} – {edu.endDate || "—"}
                    </span>
                  </div>

                  {edu.location && (
                    <p className="text-xs text-gray-500 italic mt-1 break-words">{edu.location}</p>
                  )}

                  {edu.description && (
                    <p className="text-xs md:text-base text-gray-700 mt-1 text-justify break-words">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <Section title="SKILLS">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-pink-600 rounded-full mr-2"></span>
                  <span className="text-xs md:text-base text-gray-700 break-words">{skill}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <Section title="PROJECTS">
            <div className="space-y-3 md:space-y-5">
              {projects.map((project, index) => (
                <div key={index} className="pl-3 md:pl-4 border-l-2 border-pink-200">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-1">
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 break-words">
                      {project.title}
                    </h3>
                    {(project.startDate || project.endDate) && (
                      <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                        {project.startDate} – {project.endDate || "—"}
                      </span>
                    )}
                  </div>

                  <p className="text-xs md:text-base text-gray-700 mb-2 text-justify break-words">
                    {project.description}
                  </p>

                  {project.technologies && (
                    <div className="flex flex-wrap gap-1 md:gap-2 mb-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] md:text-xs rounded border border-gray-200 break-words"
                        >
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
                      className="inline-flex items-center text-pink-600 hover:text-pink-800 text-xs md:text-sm font-medium"
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
            {additionalSections.some(sec => sec.type === "certifications") && (
              <Section title="CERTIFICATION">
                <div className="space-y-2 md:space-y-3">
                  {additionalSections
                    .filter(sec => sec.type === "certifications")
                    .flatMap(sec => sec.items || [])
                    .map((item, i) => (
                      <div key={i}>
                        <h4 className="font-bold text-xs md:text-base text-gray-900 break-words">
                          {item.title}
                        </h4>
                        <p className="text-xs md:text-base text-gray-600 break-words">{item.content}</p>
                      </div>
                    ))}
                </div>
              </Section>
            )}

            {additionalSections.some(sec => sec.type === "languages") && (
              <Section title="LANGUAGES">
                <div className="grid grid-cols-2 gap-2">
                  {additionalSections
                    .filter(sec => sec.type === "languages")
                    .flatMap(sec => sec.items || [])
                    .map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b border-gray-100 pb-1 break-words"
                      >
                        <span className="font-medium text-xs md:text-base text-gray-900">
                          {item.title}
                        </span>
                        <span className="text-xs md:text-base text-gray-600">{item.content}</span>
                      </div>
                    ))}
                </div>
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
}