"use client";

import type { ResumeData } from "@/context/resume-context";
import { Mail, Phone, MapPin, Link2, Award, GraduationCap, BookOpen, Languages, Briefcase, User } from "lucide-react";

interface ResumeTemplateProps {
  data: ResumeData;
}

export default function ResumeTemplate5({ data }: ResumeTemplateProps) {
  const { personalInfo, workExperience, education, skills, projects, additionalSections } = data;

  return (
    <div className="bg-white min-h-[1100px] text-gray-800 font-sans p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row gap-6 items-start">
        {/* Profile Picture */}
        {personalInfo?.profilePicture && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src={personalInfo.profilePicture}
              alt={personalInfo.fullName || "Profile"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Name, Title, Contact */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-700 mb-1">{personalInfo?.fullName || "Your Name"}</h1>
          <p className="text-xl italic text-blue-600 mb-3">{personalInfo?.jobTitle || "Professional Title"}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            {personalInfo?.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Section */}
      {personalInfo?.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Profile
          </h2>
          <p className="leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Professional Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
            Professional Experience
          </h2>
          <div className="space-y-6">
            {workExperience.map((job, index) => (
              <div key={index} className="pl-5 border-l-2 border-gray-300">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-lg">{job.jobTitle}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    {job.location && <p className="text-sm text-gray-500">{job.location}</p>}
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

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
            Education
          </h2>
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

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-blue-600" />
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {additionalSections && additionalSections.some((sec) => sec.type === "languages") && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Languages className="h-5 w-5 mr-2 text-blue-600" />
            Languages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalSections
              .filter((sec) => sec.type === "languages")
              .flatMap((sec) => sec.items || [])
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.title}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full mx-0.5 ${
                          i < (item.content.includes("Native") ? 5 : item.content.includes("Fluent") ? 4 : item.content.includes("Intermediate") ? 3 : item.content.includes("Basic") ? 2 : 1)
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      ></span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Additional Sections (Certifications, Publications, etc.) */}
      {additionalSections &&
        additionalSections
          .filter((sec) => !["languages"].includes(sec.type))
          .map((sec, idx) => (
            <section key={idx} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                {sec.title}
              </h2>
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