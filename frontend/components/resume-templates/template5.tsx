// components/resume-templates/template5.tsx
"use client";

import type { ResumeData } from "@/context/resume-context";
import { Mail, Phone, MapPin, Link2 } from "lucide-react";

interface ResumeTemplateProps {
  data: ResumeData;
}

export default function ResumeTemplate5({ data }: ResumeTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, additionalSections } = data;

  return (
    <div className="bg-white min-h-[1100px] text-gray-800 font-sans p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row gap-6 items-start border-b border-transparent pb-4">
        {/* Profile Picture */}
        {personalInfo?.profilePicture && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
            <img
              src={personalInfo.profilePicture}
              alt={personalInfo.fullName || "Profile"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Name, Title, Contact */}
        <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-4 w-full">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-1 capitalize">{personalInfo?.fullName || "Your Name"}</h1>
            <p className="text-xl font-medium text-blue-700 mb-3 capitalize">{personalInfo?.jobTitle || "Software Developer"}</p>
          </div>

          {/* Contact Info - Right Aligned */}
          <div className="md:ml-auto md:text-right text-sm text-gray-600 space-y-1">
            <h2 className="font-bold text-blue-600 mb-2 text-xs uppercase tracking-wide">CONTACT INFO</h2>
            
            {personalInfo?.email && (
              <div className="flex items-center md:justify-end gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            
            {personalInfo?.phone && (
              <div className="flex items-center md:justify-end gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            
            {personalInfo?.location && (
              <div className="flex items-center md:justify-end gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            
            {personalInfo?.website && (
              <div className="flex items-center md:justify-end gap-2">
                <Link2 className="h-4 w-4 text-blue-600" />
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Personal Profile */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-blue-600 mb-2 uppercase">PERSONAL PROFILE</h2>
          <div className="border-t border-gray-300 pt-3">
            <p className="leading-relaxed text-gray-700 text-sm md:text-base text-justify">
              {personalInfo.summary}
            </p>
          </div>
        </section>
      )}

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-blue-600 mb-2 uppercase">WORK EXPERIENCE</h2>
          <div className="border-t border-gray-300 pt-3 space-y-6">
            {workExperience.map((job, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-gray-800 capitalize">{job.jobTitle}</h3>
                    <p className="text-gray-600 font-medium text-sm">{job.company}</p>
                    {job.location && <p className="text-xs text-gray-500">{job.location}</p>}
                  </div>
                  <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                    {job.startDate} – {job.currentlyWorking ? 'Present' : job.endDate}
                  </span>
                </div>
                {job.description && <p className="text-gray-700 mt-2 text-sm md:text-base leading-relaxed">{job.description}</p>}
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 ml-1 text-sm md:text-base">
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

      {/* Education + Skills Side by Side with Increased Gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mb-8">
        
        {/* Education Section */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-blue-600 mb-2 uppercase">EDUCATION</h2>
            <div className="border-t border-gray-300 pt-3 space-y-5">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-base text-gray-800">{edu.degree}</h3>
                      <p className="text-gray-600 text-sm">{edu.fieldOfStudy}</p>
                      <p className="text-sm text-gray-500 italic">{edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap ml-2">
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </span>
                  </div>
                  {edu.gpa && <p className="text-sm text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-gray-700 mt-1 text-sm leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-blue-600 mb-2 uppercase">SKILLS</h2>
            <div className="border-t border-gray-300 pt-3">
              <ul className="space-y-2">
                {skills.map((skill, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 shrink-0"></span>
                    <span className="text-gray-700 text-sm md:text-base font-medium capitalize">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-blue-600 mb-2 uppercase">PROJECTS</h2>
          <div className="border-t border-gray-300 pt-3 space-y-5">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-base md:text-lg text-gray-800">{project.title}</h3>
                  {(project.startDate || project.endDate) && (
                    <span className="text-xs text-gray-500 font-medium">
                      {project.startDate} – {project.endDate || 'Present'}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 mb-2 text-sm md:text-base leading-relaxed">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
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
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
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

      {/* Additional Sections */}
      {additionalSections && additionalSections.length > 0 && (
        <>
          {additionalSections.map((sec, idx) => (
            <section key={idx} className="mb-8">
              <h2 className="text-lg font-bold text-blue-600 mb-2 uppercase">{sec.title}</h2>
              <div className="border-t border-gray-300 pt-3 space-y-3">
                {sec.items?.map((item, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.title}</h3>
                    <p className="text-gray-700 text-sm md:text-base">{item.content}</p>
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