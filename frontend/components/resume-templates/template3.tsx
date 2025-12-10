// components/resume-templates/template3.tsx
"use client";

import type { ResumeData } from "@/context/resume-context";
import { Mail, Phone, MapPin, Link2, Diamond, BarChart3 } from "lucide-react";

interface ResumeTemplateProps {
  data: ResumeData;
}

export default function ResumeTemplate3({ data }: ResumeTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, additionalSections } = data;

  return (
    <div className="bg-white min-h-[1100px] text-gray-800 font-sans p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-green-900 mb-1">{personalInfo?.fullName || "Your Name"}</h1>
          <p className="text-xl font-medium text-green-600 mb-3">{personalInfo?.jobTitle || "Head of Sales"}</p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1 text-green-600" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1 text-green-600" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.website && (
              <div className="flex items-center">
                <Link2 className="h-4 w-4 mr-1 text-green-600" />
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Achievements Section - Two Cards */}
      {personalInfo?.summary && (
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-green-200 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-green-900 mb-2 flex items-center">
              <Diamond className="h-5 w-5 mr-2 text-green-600" />
              I am proud of
            </h2>
            <p className="text-gray-700">{personalInfo.summary}</p>
          </div>
          <div className="bg-white border border-green-200 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-green-900 mb-2 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              Doubled down on turnover
            </h2>
            <p className="text-gray-700">Increased sales department turnover by 30% in an extremely talent demanding niche</p>
          </div>
        </section>
      )}

      {/* Experience Section - Vertical Timeline */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">EXPERIENCE</h2>
          <div className="space-y-6">
            {workExperience.map((job, index) => (
              <div key={index} className="flex gap-4">
                {/* Date Column */}
                <div className="w-32 flex-shrink-0 text-sm text-gray-600">
                  <div className="font-semibold">{job.startDate} - {job.currentlyWorking ? 'Ongoing' : job.endDate}</div>
                  <div>{job.location || 'Location'}</div>
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-300"></div>

                {/* Job Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-green-800">{job.jobTitle}</h3>
                  <p className="text-green-600 font-medium">{job.company}</p>
                  {job.description && <p className="mt-2 text-gray-700">{job.description}</p>}
                  {job.achievements && job.achievements.length > 0 && (
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                      {job.achievements.map((achievement, i) => (
                        <li key={i}>{achievement.text}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section - Vertical Timeline */}
      {education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">EDUCATION</h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="flex gap-4">
                {/* Date Column */}
                <div className="w-32 flex-shrink-0 text-sm text-gray-600">
                  <div className="font-semibold">{edu.startDate} - {edu.endDate || '—'}</div>
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-300"></div>

                {/* Education Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-green-800">{edu.degree}</h3>
                  <p className="text-green-600 font-medium">{edu.fieldOfStudy}</p>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="mt-1 text-gray-700">{edu.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">SKILLS</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {additionalSections && additionalSections.some(sec => sec.type === 'languages') && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">LANGUAGES</h2>
          <div className="flex flex-wrap gap-8">
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
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  ></span>
                ));

                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.title}</span>
                    <span className="text-sm text-gray-600">{item.content}</span>
                    <div className="flex">{dots}</div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Additional Sections */}
      {additionalSections &&
        additionalSections
          .filter(sec => !['languages'].includes(sec.type))
          .map((sec, idx) => (
            <section key={idx} className="mb-8">
              <h2 className="text-xl font-bold text-green-900 mb-4">{sec.title}</h2>
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
    </div>
  );
}