"use client";
import React from "react";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";
import { Card, CardContent } from "../../ui/Card";

export function ClassicResume({ resumeData = {} }) {
  const {
    personalInfo = {},
    education = [],
    workExperience = [],
    projects = [],
    skills = {},
    achievements = [],
    certificate = [],
  } = resumeData;

  const fullName = `${personalInfo.firstName || ""} ${personalInfo.middleName || ""} ${personalInfo.lastName || ""}`.trim();

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date + "-01");
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
     <div id="resume-preview" className="flex justify-center items-center">
    <Card className="bg-[#faf8f6] shadow-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-300  w-auto h-auto ">
      <CardContent>
        <div className=" text-black min-h-[1123px] min-w-[794px]  p-4 font-[ui-serif] w-auto leading-tight dark:bg-gray-300">
          {/* HEADER */}
          <div className="text-center mb-2">
            <h1 className="text-3xl font-semibold tracking-wide">
              {fullName.toUpperCase()  || "YOUR NAME"}
            </h1>

            <p className="text-sm mt-1">
              {(personalInfo?.city || personalInfo?.state) && (
              <div className="text-[15px] font-semibold">
                {[personalInfo?.city, personalInfo?.state].filter(Boolean).join(", ")}
              </div>
            )}
            </p>

            <div className="flex justify-center gap-3 text-xs mt-1 flex-wrap">
             {personalInfo.phone && ( <div className="flex gap-1 items-center">
                <FaPhone size={8} />
                <span>{personalInfo.phone}</span>
              </div>)}
              { personalInfo.email && (<div className="flex gap-1 items-center">
                <MdEmail size={11} />
                <span>{personalInfo.email}</span>
              </div>)}
              {personalInfo.linkedin && (<div className="flex gap-1 items-center">
                <FaLinkedin size={10} />
                <span>{personalInfo.linkedin}</span>
              </div>)}
              {personalInfo.website && (<div className="flex gap-1 items-center">
                <IoLogoGithub size={10} />
                <span>{personalInfo.website}</span>
              </div>)}
              {/* <div className="flex gap-1 items-center"><FaPhone size={9}/><span>{personalInfo.phone}</span></div>          */}
            </div>
          </div>

          {/* EDUCATION */}
          <Section title="Education">
            {education.map((edu) => (
              <div key={edu.id} className="mb-0.5">
                <div className="flex justify-between text-[13px]">
                  <p className="font-semibold ">{edu.institution}</p>
                  <p>
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </p>
                </div>

                <div className="flex text-[13px] italic">
                  <p>
                    {edu.degree} {edu.field && <span>in {edu.field}</span>}
                  </p>
                  {edu.scoreType && (
                    <p>
                      , {edu.scoreType} :{" "}
                      <span className="font-semibold">{edu.scoreValue}</span>
                      {edu.scoreType === "Percentage" && "%"}
                    </p>
                  )}
                  {edu.city && (
                    <p>
                      {edu.city}, {edu.state}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </Section>

          {/* EXPERIENCE */}
          <Section title="Experience">
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-1">
                <div className="flex justify-between">
                  <p className="font-semibold text-[13px]">{exp.company}</p>
                  <p className="text-[13px]">
                    {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                  </p>
                </div>

                <div className="flex justify-between italic text-sm">
                  <p>{exp.position}</p>
                  {exp.city && exp.state && (
                    <p>
                      {exp.city}, {exp.state}
                    </p>
                  )}
                </div>

                <ul className="list-disc pl-5 text-[13px] leading-tight">
                  {exp.description
                    ?.split(".")
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i}>{line.trim()}</li>
                    ))}
                </ul>
              </div>
            ))}
          </Section>

          {/* PROJECTS */}
          <Section title="Projects">
            {projects.map((proj) => (
              <div key={proj.id} className="mb-1">
                <div className="flex justify-between">
                  <p className="font-semibold text-[13px]">
                    {proj.name}{" "}
                    <span className="italic font-normal">
                      | {proj.technologies?.join(", ")}
                    </span>
                  </p>
                  <p className="text-[13px]">
                    {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                  </p>
                </div>

                <ul className="list-disc pl-5 text-[13px] leading-tight">
                  {proj.description
                    ?.split(".")
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i}>{line.trim()}</li>
                    ))}
                </ul>
              </div>
            ))}
          </Section>

          {/* SKILLS */}
          <Section title="Technical Skills">
            <div className="flex flex-col gap-1">
              <p className="text-[13px] font-medium ">
                <strong>Languages:</strong> {skills.languages?.join(", ")}
              </p>
              <p className="text-[13px]">
                <strong>Developer Tools:</strong> {skills.tools?.join(", ")}
              </p>
              <p className="text-[13px]">
                <strong>Technologies/Frameworks:</strong>{" "}
                {skills.technologies?.join(", ")}
              </p>
            </div>
          </Section>

          {/* ACHIVEMENTS */}
          {achievements.length > 0 && (
            <Section title="Achivements">
              {achievements.map((ach, i) => (
                <div key={i} className="mb-1 text-[13px]">
                  <div className="flex justify-between">
                    <p className="font-semibold">{ach.title}</p>
                  </div>

                  <ul className="list-disc pl-5 text-[13px]">
                    {ach.description
                      ?.split(".")
                      .filter(Boolean)
                      .map((line, j) => (
                        <li key={j}>{line.trim()}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </Section>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

/* SECTION */
function Section({ title, children }) {
  return (
    <div className="mt-4">
      <h2 className="font-bold border-b border-black mb-1">{title}</h2>
      {children}
    </div>
  );
}
