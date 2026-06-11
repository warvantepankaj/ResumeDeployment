"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/builder/components/ui/Card";
import { Button } from "@/builder/components/ui/Button";
import { useToast } from "@/builder/hooks/use-toast";
import { Download, FileText, Loader2 } from "lucide-react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoIosContact } from "react-icons/io";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { RiLinkedinBoxFill } from "react-icons/ri";
import { CiLink } from "react-icons/ci";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function B_WResume({ resumeData = {}}) {

  const {
    personalInfo = {},
    professionalSummary = "",
    workExperience = [],
    projects = [],
    education = [],
    skills = { technical: [], soft: [], languages: [] },
   
    certificate = [],
    achievements = [],
  } = resumeData;

  const [isExporting, setIsExporting] = useState(null);


  const fullName =
    `${personalInfo.firstName || ""} ${personalInfo.middleName || ""} ${personalInfo.lastName || ""}`.trim();

  const handleExport = async () => {
  const element = document.getElementById("resume-preview");

  const html = element.outerHTML;

  const res = await fetch("http://localhost:8000/generate-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html }),
  });

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  a.click();
};

  return (
    <div id="printable-resume-content" className="flex justify-center items-center">
    

      <div className="bg-white shadow-xl min-h-[1123px] min-w-[794px] flex border border-gray-300 dark:border-gray-600">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="w-[35%] bg-[#374151] text-gray-200 dark:text-gray-300 p-4 flex flex-col gap-6">
          {/* Profile Image */}
          <div className="flex justify-center text-center">
            <img
              src={
                personalInfo.profilePhoto?.url ||
                "https://via.placeholder.com/150"
              }
              alt=""
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
            />
          </div>

          {/* Contact */}
          <div>
            {personalInfo.city && (
              <h2 className="font-semibold w-full text-xl border-b border-gray-400 pb-1 mb-1">
                CONTACT
              </h2>
            )}

            <div className="flex flex-col gap-2 font-medium mt-2">
              {personalInfo.phone && (
                <div className="flex gap-2  items-center">
                  <IoIosContact />
                  <p className="text-sm">{personalInfo.phone}</p>
                </div>
              )}

              {personalInfo.email && (
                <div className="flex gap-2 items-center">
                  <MdOutlineAlternateEmail />
                  <p className="text-sm">{(personalInfo.email).length>20 ? personalInfo.email.split(18
                    
                  )+".." : personalInfo.email}</p>
                </div>
              )}

              {(personalInfo.city || personalInfo.state) && (
                <div className="flex gap-2 items-center">
                  <IoLocationOutline />
                  <p className="text-sm">
                    {[personalInfo.city, personalInfo.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex gap-2 items-center">
                  <RiLinkedinBoxFill />
                  <p className="text-sm">LinkedIn</p>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex gap-2 items-center">
                  <CiLink />
                  <p className="text-sm">Portfolio</p>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div className="w-full">
              <h2 className="font-semibold text-lg border-b border-gray-400 pb-1 mb-1">
                EDUCTION
              </h2>

              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="font-semibold text-sm mb-3 pl-1"
                >
                 {edu.startDate && ( <p className="text-[11px] font-normal">
                    {edu.startDate} - {edu.endDate}
                  </p>)}
                  <p className="text-[12.5px] leading-tight">
                    {edu.institution}
                  </p>
                  {/* <p className="font-semibold text-[13px] leading-4 mb-1">
                    {edu.degree} {edu.field}
                  </p> */}
                  <ul className="list-disc ml-5 mt-1 inline-block">
                    {edu?.degree && (<li className="text-[13px] font-normal leading-tight">
                      {edu?.degree}
                    </li>)}
                    {edu.scoreValue && (<li className="text-[13px] font-normal leading-tight">
                      {edu.scoreType} : <span className="font-semibold">{edu.scoreValue}</span>
                      {edu.scoreType === "Percentage" && "%"}
                    </li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Expertise (Skills) */}

          {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
            <div>
              <h2 className="font-semibold text-lg border-b border-gray-400 pb-1 mb-2">
                SKILLS
              </h2>

              <ul className="text-[12px] space-y-1 pl-1">
                {/* <span className="text-sm font-medium">Technical :</span> */}
                {skills.technical?.length > 0 && (
                  // <span key={i}>{skill}</span>
                  <p>
                    <span className="text-[13px] inline-block pr-1 font-semibold">
                      Technical Skills :{" "}
                    </span>
                    {skills.technical?.join(", ")}
                  </p>
                )}
                {skills.soft?.length > 0 && (
                  // <span key={i}>{skill}</span>
                  <p>
                    <span className="text-[13px] inline-block pr-1 font-semibold">
                      Soft Skills :{" "}
                    </span>
                    {skills.soft?.join(", ")}
                  </p>
                )}
              </ul>
            </div>
          )}

          {/* Languages */}

          {skills.languages && skills.languages.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg border-b border-gray-400 pb-1 mb-2">
                LANGUAGES
              </h2>

              <ul className="text-[13px] pl-1 ml-5">
                {skills.languages.map((language, indx) => (
                  <li key={indx} className="list-disc">
                    {language}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="w-[68%] p-6 bg-gray-50 dark:bg-gray-300">
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-gray-800">
              {fullName.toUpperCase() || "Your Name"}
            </h1>
            {/* <p className="text-gray-500 tracking-widest uppercase text-sm">
              {personalInfo.title || "Your Role"}
            </p> */}

            {professionalSummary && (
              <p className="text-xs text-justify text-gray-600 mt-3 leading-4">
                {professionalSummary}
              </p>
            )}
          </div>

          {/* Experience */}
          {workExperience.length > 0 && (
            <div className="mb-2">
              <h2 className="font-semibold text-lg border-b pb-1 mb-2 text-gray-700">
                EXPERIENCE
              </h2>

              {workExperience.map((exp) => (
                <div
                  key={exp.id}
                  className="mb-2 relative pl-5 border-l border-gray-300"
                >
                  {/* Dot */}
                  <div className="absolute left-[-6px] top-1 w-3 h-3 bg-gray-600 rounded-full"></div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-600">
                      {exp.company}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                  </div>

                  <h3 className="font-semibold text-[14px] text-gray-800">
                    {exp.position}
                  </h3>

                  <p className="text-[12px] text-gray-600 leading-tight ">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Project */}
          {projects.length > 0 && (
            <div className="mb-1 mt-3">
              <h2 className="font-semibold text-lg border-b mb-1 text-gray-700">
                PROJECT
              </h2>

              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="mb-2 relative pl-5 border-l border-gray-300"
                >
                  {/* Dot */}
                  <div className="absolute left-[-6px] top-1 w-3 h-3 bg-gray-600 rounded-full"></div>

                  <div className="flex justify-between items-center text-sm text-gray-800">
                    {/* Left side: Project Name + Link */}
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-700">
                        {proj.name}
                      </h3>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2A5DB0] text-xs underline"
                        >
                          Link
                        </a>
                      )}
                    </div>

                    {/* Right side: Date */}
                    <p className="text-[11px] text-gray-500">
                      {proj.startDate || "N/A"} - {proj.endDate || "Present"}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-[11.5px] leading-tight text-gray-600 ">
                    {proj.description && (
                      <ul className="list-disc leading-4 text-[12px] dark:text-gray-600 pl-5">
                        {proj.description
                          .split(/(?<=\.)\s+(?=[A-Z])/g)
                          .filter((sentence) => sentence.trim() !== "")
                          .map((sentence, index) => (
                            <li key={index} className="pl-1 text-left">
                              {sentence.trim()}
                            </li>
                          ))}
                      </ul>
                    )}
                  </p>

                  {/* Technologies */}
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {proj.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs flex  justify-center bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-400 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Achievement */}
          {achievements.length > 0 && (
            <div className="mb-2 mt-3">
              <h2 className="font-semibold text-lg border-b  mb-1 text-gray-700">
                ACHIEVEMENT
              </h2>

              {achievements.map((achivement, indx) => (
                <div
                  key={indx}
                  className="mb-1 relative pl-5 border-l border-gray-300"
                >
                  {/* Dot */}
                  <div className="absolute left-[-6px] top-1 w-3 h-3 bg-gray-600 rounded-full"></div>

                  <div className="flex items-center justify-between">
                    <p className="text-[13.5px] font-semibold text-gray-700">
                      {achivement.title}
                    </p>
                  </div>

                  <p className="text-[12px] text-gray-600 leading-tight ">
                    {achivement.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* certifications */}
          {certificate.length > 0 && (
            <div className="mb-2 mt-3">
              <h2 className="font-semibold text-lg border-b  mb-1 text-gray-700">
                CERTIFICATS
              </h2>

              {certificate.map((certifi, indx) => (
                <div
                  key={indx}
                  className="mb-1 relative pl-5 border-l border-gray-300"
                >
                  {/* Dot */}
                  <div className="absolute left-[-6px] top-1 w-3 h-3 bg-gray-600 rounded-full"></div>

                  <div className="flex items-center justify-between">
                    <p className="text-[13.5px] font-semibold text-gray-600">
                      {certifi.title}
                    </p>
                  </div>

                  <p className="text-[12px] text-gray-600 leading-tight ">
                    {certifi.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}