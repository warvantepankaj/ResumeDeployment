"use client";
import { useState } from "react";
import { Card, CardContent } from "@/builder/components/ui/Card";
import { Button } from "@/builder/components/ui/Button";
import { useToast } from "@/builder/hooks/use-toast";
import axios from "axios";

export function StandardBlueResume({
  resumeData = {},
  compact = false,
  length = 0,
}) {
  const [isExporting, setIsExporting] = useState(null);
  const { toast } = useToast();

  const {
    personalInfo = {},
    professionalSummary = "",
    workExperience = [],
    education = [],
    skills = { technical: {}, soft: [] },
    languages = [],
    projects = [],
    certificate = [],
    achievements = [],
  } = resumeData;

  const fullName =
    `${personalInfo.firstName || ""} ${personalInfo.middleName || ""} ${personalInfo.lastName || ""}`.trim();

  // --- HELPER FUNCTIONS ---
  const getHref = (url) => {
    if (!url) return "#";
    const cleanUrl = url.replace(/^https?:\/\//, "");
    return `https://${cleanUrl}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // --- EXPORT LOGIC ---
  const handleExport = async (format) => {
    setIsExporting(format);
    try {
      const resumeElement = document.getElementById("printable-resume-content");

      if (!resumeElement) {
        toast({
          title: "Error",
          description: "Could not find resume content.",
          variant: "destructive",
        });
        return;
      }

      const htmlContent = resumeElement.innerHTML;

      const response = await axios.post(
        "http://localhost:8080/export",
        { htmlContent, format },
        { responseType: "blob" },
      );

      const blob = new Blob([response.data], {
        type:
          format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume.${format === "word" ? "docx" : "pdf"}`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `Downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error("EXPORT ERROR:", error);
      toast({
        title: "Export Failed",
        description: "Something went wrong. Check the server console.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  // Section Header Component for Reusability
  const SectionHeader = ({ title }) => (
    <div className="mt-3 mb-1 text-center">
      <h2 className="text-[15px] font-bold text-[#0F52BA] uppercase tracking-wide">
        {title}
      </h2>
      <div className="border-t-[1.5px] border-black dark:border-gray-400 mt-[2px]"></div>
    </div>
  );

  // Skills Logic Check
  const techSkills = skills.technical || {};
  const isTechArray = Array.isArray(techSkills);
  const hasNewTechSkills =
    !isTechArray &&
    (techSkills.programmingLanguages?.length > 0 ||
      techSkills.frameworks?.length > 0 ||
      techSkills.databases?.length > 0 ||
      techSkills.tools?.length > 0);
  const hasLegacyTechSkills = isTechArray && techSkills.length > 0;
  const hasSoftSkills = skills.soft?.length > 0;
  const hasLanguages = languages?.length > 0;
  const showSkillsSection =
    hasNewTechSkills || hasLegacyTechSkills || hasSoftSkills || hasLanguages;

  return (
    <div id="resume-preview" className="flex justify-center items-center">
      <div className="bg-[#fcfaf8] shadow-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 w-auto h-auto">
          <div
            id="printable-resume-content"
            className="dark:bg-gray-800 p-1 min-h-[1123px] min-w-[794px] text-black dark:text-gray-200 font-sans px-6 py-8"
          >
            {/* HEADER */}
            <div className="text-center mb-4">
              <h1 className="text-[26px] font-bold uppercase text-black dark:text-white">
                {fullName || "YOUR NAME"}
              </h1>

              {personalInfo?.jobTitle && (
                <p className="text-[16px] font-bold text-black dark:text-gray-200 mt-1">
                  {personalInfo.jobTitle}
                </p>
              )}

              <div className="flex flex-wrap justify-center items-center gap-2 text-[14px] mt-1 text-black dark:text-gray-300">
                {personalInfo?.phone && <span>{personalInfo?.phone}</span>}

                {personalInfo?.email && (
                  <>
                    {personalInfo.phone && (
                      <span className="text-gray-400">|</span>
                    )}
                    <a
                      href={`mailto:${personalInfo?.email}`}
                      className="text-[#0F52BA] hover:underline cursor-pointer"
                    >
                      {personalInfo.email}
                    </a>
                  </>
                )}

                {personalInfo?.linkedin && (
                  <>
                    {(personalInfo?.phone || personalInfo?.email) && (
                      <span className="text-gray-400">|</span>
                    )}
                    <a
                      href={getHref(personalInfo?.linkedin)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0F52BA] hover:underline cursor-pointer"
                    >
                      LinkedIn
                    </a>
                  </>
                )}

                {personalInfo?.website && (
                  <>
                    {(personalInfo?.phone ||
                      personalInfo?.email ||
                      personalInfo?.linkedin) && (
                      <span className="text-gray-400">|</span>
                    )}
                    <a
                      href={getHref(personalInfo?.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0F52BA] hover:underline cursor-pointer"
                    >
                      Portfolio
                    </a>
                  </>
                )}

                {(personalInfo?.city || personalInfo?.state) && (
                  <>
                    <span className="text-gray-400">|</span>
                    <span>
                      {[personalInfo?.city, personalInfo?.state]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* SUMMARY */}
            {professionalSummary && (
              <div className="mb-2 text-[20px ">
                <SectionHeader title="Professional Summary" />
                <p className="text-[13px] leading-relaxed text-justify px-1">
                  {professionalSummary}
                </p>
              </div>
            )}

            {/* SKILLS & LANGUAGES */}
            {showSkillsSection && (
              <div className="mb-2">
                <SectionHeader title="Skills" />
                <div className="text-[13px] leading-relaxed px-1">
                  {/* Legacy Array Fallback */}
                  {hasLegacyTechSkills && (
                    <div>
                      <span className="font-bold">Technical Skills: </span>
                      {techSkills.join(", ")}
                    </div>
                  )}

                  {/* New Object Structure */}
                  {!isTechArray &&
                    techSkills.programmingLanguages?.length > 0 && (
                      <div>
                        <span className="font-bold">
                          Programming Languages :{" "}
                        </span>
                        {techSkills.programmingLanguages.join(", ")}
                      </div>
                    )}
                  {!isTechArray && techSkills.frameworks?.length > 0 && (
                    <div>
                      <span className="font-bold">
                        Frameworks & Libraries :{" "}
                      </span>
                      {techSkills.frameworks.join(", ")}
                    </div>
                  )}
                  {!isTechArray && techSkills.databases?.length > 0 && (
                    <div>
                      <span className="font-bold">Databases : </span>
                      {techSkills.databases.join(", ")}
                    </div>
                  )}
                  {!isTechArray && techSkills.tools?.length > 0 && (
                    <div>
                      <span className="font-bold">Tools & Platforms : </span>
                      {techSkills.tools.join(", ")}
                    </div>
                  )}

                  {/* Soft Skills */}
                  {hasSoftSkills && (
                    <div>
                      <span className="font-bold">Soft Skills : </span>
                      {skills.soft.join(", ")}
                    </div>
                  )}
                  
                </div>
              </div>
            )}

            {/* WORK EXPERIENCE */}
            {workExperience?.length > 0 &&
              workExperience[0].position !== "" && (
                <div className="mb-2">
                  <SectionHeader
                    title={`Professional Experience (${workExperience.length > 0 ? "1+" : "0"} Years)`}
                  />

                  {workExperience.map((exp) => (
                    <div key={exp.id} className="mb-3 px-1">
                      <div className="flex justify-between items-end">
                        <span className="font-semibold text-[#0F52BA] text-[14px]">
                          {exp.position}
                        </span>
                        <span className="font-semibold text-[#0F52BA] text-[13px]">
                          {formatDate(exp.startDate)} -{" "}
                          {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      </div>

                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-[13px] text-gray-900 dark:text-gray-200">
                          {exp.company}
                        </span>
                        {exp.location && (
                          <span className="font-bold text-[13px] text-gray-900 dark:text-gray-200">
                            {exp.location}
                          </span>
                        )}
                      </div>

                      {exp.description && (
                        <ul className="list-disc text-[13px] text-justify leading-5 pl-5 font-[450]">
                          {exp.description
                            .split(/(?<=\.)\s+(?=[A-Z])/g)
                            .filter((sentence) => sentence.trim() !== "")
                            .map((sentence, index) => (
                              <li key={index}>{sentence.trim()}</li>
                            ))}
                        </ul>
                      )}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="text-[12px] italic underline mt-1 ml-2">
                          Technologies Used: {exp.technologies.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            {/* PROJECTS */}
            {projects.length > 0 && projects[0].name !== "" && (
              <div className="mb-2">
                <SectionHeader title="Projects" />

                {projects.map((p) => (
                  <div key={p.id} className="mb-3 px-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-[14px] text-gray-900 dark:text-gray-200">
                        {p.name}
                      </span>
                      <span className="font-bold text-[13px] text-gray-900 dark:text-gray-200">
                        {formatDate(p.startDate)} - {formatDate(p.endDate)}
                      </span>
                    </div>

                    {p.description && (
                      <ul className="list-disc text-[13px] text-justify leading-5 pl-5">
                        {p.description
                          .split(/(?<=\.)\s+(?=[A-Z])/g)
                          .filter((sentence) => sentence.trim() !== "")
                          .map((sentence, index) => (
                            <li key={index}>{sentence.trim()}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION */}
            {education?.length > 0 && education[0].institution !== "" && (
              <div className="mb-2">
                <SectionHeader title="Education" />

                {education.map((edu) => (
                  <div key={edu.id} className="px-1 text-[13px] mb-1">
                    <span className="font-bold text-gray-900 dark:text-gray-200">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 mx-2">
                      |
                    </span>
                    <span>{formatDate(edu.endDate)}</span>
                    <span className="text-gray-600 dark:text-gray-400 mx-2">
                      |
                    </span>
                    <span>{edu.institution}</span>
                    {edu.gpa && <span> (GPA: {edu.gpa})</span>}
                  </div>
                ))}
              </div>
            )}

            {/* CERTIFICATIONS */}
            {certificate.length > 0 && certificate[0].title !== "" && (
              <div className="mb-2">
                <SectionHeader title="Certifications" />

                <div className="px-1 text-[13px] font-bold text-gray-900 dark:text-gray-200">
                  {certificate.map((cert, index) => (
                    <span key={cert.id}>
                      {cert.title} {cert.issuer && `(${cert.issuer})`}
                      {index < certificate.length - 1 && (
                        <span className="mx-2 text-gray-500">|</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
