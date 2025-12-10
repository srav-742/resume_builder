// components/resume-templates/template2.tsx
"use client";

import type { ResumeData } from "@/context/resume-context";
import { Mail, Phone, MapPin, Link2, Calendar, GraduationCap, BookOpen, Languages } from "lucide-react";

interface ResumeTemplateProps {
  data: ResumeData;
}

export default function ResumeTemplate2({ data }: ResumeTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, additionalSections } = data;

  return (
    <div className="bg-white min-h-[1100px] text-gray-800 font-sans p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-800 mb-1">{personalInfo?.fullName || "Your Name"}</h1>
          <p className="text-xl font-medium text-blue-600 mb-3">{personalInfo?.jobTitle || "Customer Success Manager"}</p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1 text-blue-600" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1 text-blue-600" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo?.website && (
              <div className="flex items-center">
                <Link2 className="h-4 w-4 mr-1 text-blue-600" />
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Summary */}
          {personalInfo?.summary && (
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-4 border-b-2 border-blue-800 pb-1">SUMMARY</h2>
              <p className="leading-relaxed text-gray-700">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {workExperience && workExperience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-4 border-b-2 border-blue-800 pb-1">EXPERIENCE</h2>
              <div className="space-y-6">
                {workExperience.map((job, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-bold text-lg text-blue-800">{job.jobTitle}</h3>
                    <p className="text-blue-600 font-medium">{job.company}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{job.startDate} - {job.currentlyWorking ? 'Ongoing' : job.endDate}</span>
                      </div>
                      {job.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{job.location}</span>
                        </div>
                      )}
                    </div>
                    {job.description && <p className="mt-2 text-gray-700">{job.description}</p>}
                    {job.achievements && job.achievements.length > 0 && (
                      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
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
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-4 border-b-2 border-blue-800 pb-1">EDUCATION</h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-lg text-blue-800">{edu.degree}</h3>
                    <p className="text-blue-600 font-medium">{edu.institution}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{edu.startDate} - {edu.endDate || '—'}</span>
                      </div>
                      {edu.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{edu.location}</span>
                        </div>
                      )}
                    </div>
                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                    {edu.description && <p className="mt-1 text-gray-700">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-4 border-b-2 border-blue-800 pb-1">SKILLS</h2>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="border-b border-gray-200 pb-1 last:border-0 last:pb-0">
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Strengths */}
          {additionalSections && additionalSections.some(sec => sec.type === 'strengths') && (
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-4 border-b-2 border-blue-800 pb-1">STRENGTHS</h2>
              <div className="space-y-4">
                {additionalSections
                  .filter(sec => sec.type === 'strengths')
                  .flatMap(sec => sec.items || [])
                  .map((item, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {additionalSections && additionalSections.some(sec => sec.type === 'languages') && (
            <section>
              <h2 className="text-xl font-bold text-blue-800 mb-4 border-b-2 border-blue-800 pb-1">LANGUAGES</h2>
              <div className="space-y-4">
                {additionalSections
                  .filter(sec => sec.type === 'languages')
                  .flatMap(sec => sec.items || [])
                  .map((item, i) => {
                    const level = item.content.toLowerCase();
                    const dots = Array(5).fill(0).map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-3 h-3 rounded-full mx-0.5 ${
                          idx < (level.includes('native') ? 5 : level.includes('fluent') ? 4 : level.includes('proficient') ? 3 : level.includes('intermediate') ? 2 : 1)
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      ></span>
                    ));

                    return (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{item.title}</span>
                          <span className="ml-2 text-sm text-gray-600">{item.content}</span>
                        </div>
                        <div className="flex">{dots}</div>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}