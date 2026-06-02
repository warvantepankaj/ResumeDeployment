"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/builder/components/ui/Card"
import { Button } from "@/builder/components/ui/Button"
import { useToast } from "@/builder/hooks/use-toast"
import { Download, FileText, Loader2 } from "lucide-react"
import axios from "axios"

export function PurpleResume({ resumeData = {}, compact = false, length = 0 }) {
  const [isExporting, setIsExporting] = useState(null)
  const { toast } = useToast()

  const {
    personalInfo = {},
    professionalSummary = "",
    workExperience = [],
    education = [],
    skills = { technical: [], soft: [] },
    projects = [],
    certificate=[],
    achievements = []
  } = resumeData

  const fullName = `${personalInfo.firstName || ""} ${personalInfo.middleName || ""} ${personalInfo.lastName || ""}`.trim()

  // --- HELPER FUNCTIONS ---

  // 1. Ensure links have https:// and are absolute
  const getHref = (url) => {
    if (!url) return "#";
    const cleanUrl = url.replace(/^https?:\/\//, ""); // Remove existing protocol if present
    return `https://${cleanUrl}`;
  }

  // 2. Format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  // --- EXPORT LOGIC ---
  const handleExport = async (format) => {
    console.log("Export clicked:", format);
    setIsExporting(format);

    try {
      // 1. Select ONLY the resume content (ignoring the outer card and buttons)
      const resumeElement = document.getElementById("printable-resume-content");

      if (!resumeElement) {
        toast({
          title: "Error",
          description: "Could not find resume content.",
          variant: "destructive",
        });
        return;
      }

      // 2. Get the HTML string
      const htmlContent = resumeElement.innerHTML;

      // 3. Send to Backend
      const response = await axios.post(
        "http://localhost:8080/export",
        {
          htmlContent,
          format,
        },
        { responseType: "blob" } // Important for binary files
      );

      // 4. Create Download Link
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

      toast({ title: "Success", description: `Downloaded as ${format.toUpperCase()}` });

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

  return (

    <div id="resume-preview" className="flex justify-center items-center">

  <Card className="bg-[#faf8f6] shadow-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-800 w-auto h-auto">
    <CardContent>

      <div
        id="printable-resume-content"
        className=" dark:bg-gray-800 p-1 min-h-[1123px] min-w-[794px]  text-gray-900 dark:text-gray-200  font-sans px-4"
      >

        {/* HEADER */}
        <div className="text-center border-gray-200 dark:border-gray-700 my-4">
          <h1 className="text-4xl font-bold text-[#a55fe1]">{fullName.toUpperCase() || "Your Name"}</h1>

          <div className="text-gray-600 dark:text-gray-300 flex flex-col items-center gap-1">
            {(personalInfo?.city || personalInfo?.state) && (
              <div className="text-[17px] font-semibold">
                {[personalInfo?.city, personalInfo?.state].filter(Boolean).join(", ")}
              </div>
            )}

            <div className="flex flex-wrap justify-center items-center gap-2 text-[14px] font-medium">
              {personalInfo?.phone && <span>{personalInfo?.phone}</span>}

              {personalInfo?.email && (
                <>
                  {personalInfo.phone && <span className="text-gray-400">|</span>}
                  <a href={`mailto:${personalInfo?.email}`} className="text-[#2A5DB0]  cursor-pointer">
                    {personalInfo.email}
                  </a>
                </>
              )}

              {personalInfo?.linkedin && (
                <>
                  {(personalInfo?.phone || personalInfo?.email) && <span className="text-gray-400">|</span>}
                  <a href={getHref(personalInfo?.linkedin)} target="_blank" rel="noopener noreferrer" className="text-[#2A5DB0]  cursor-pointer">
                    LinkedIn
                  </a>
                </>
              )}

              {personalInfo?.website && (
                <>
                  {(personalInfo?.phone || personalInfo?.email || personalInfo?.linkedin) && <span className="text-gray-400">|</span>}
                  <a href={getHref(personalInfo?.website)} target="_blank" rel="noopener noreferrer" className="text-[#2A5DB0]   cursor-pointer">
                    Portfolio
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        {professionalSummary && (
          <div className="text-justify mb-2">
            <div className="flex items-center gap-2">
              <p className="text-[16px] text-[#a55fe1] font-bold">OBJECTIVE</p>
              <div className="flex-1 border-t-[0.5px] mt-1 border-[#c6acdd]"></div>
            </div>
            <p className="text-[14px] leading-tight pl-6 pr-3">
              {professionalSummary}
            </p>
          </div>
        )}

        {/* WORK EXPERIENCE */}
        {workExperience?.length > 0 && workExperience[0].title !== "" &&(
          <div className="mb-2 pt-1">
            <div className="flex items-center gap-2">
              <p className="text-[16px] text-[#a55fe1] font-bold">WORK EXPERIENCE</p>
              <div className="flex-1 border-t-[0.5px] mt-1 border-[#c6acdd]"></div>
            </div>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-1">
                <div className="flex justify-between items-start ">
                  <div>
                    <h3 className=" text-[15px] pl-4 text-gray-800 dark:text-gray-300">
                      <span className="font-semibold"> {exp.position}, {exp.company}</span>
                    </h3>
                  </div>
                  <div className="text-right pr-2">
                    <div className="text-[13px] font-medium text-black dark:text-gray-200">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                </div>
                <div className="pl-4 text-justify">
                  {exp.description && (
                    <p className="text-[13px] pl-3 leading-tight pr-2 font-normal text-black dark:text-gray-200">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements?.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside text-gray-800 text-[11px] dark:text-gray-300 space-y-">
                      {exp.achievements.filter(Boolean).map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EDUCATION */}
        {education?.length > 0 && education[0].title !== "" &&(
          <div className="mt-2 pl-1 mb-2">
            <div className="flex items-center gap-2">
              <p className="text-[16px] text-[#a55fe1] font-bold mb-1">EDUCATION</p>
              <div className="flex-1 border-t-[0.5px] mt-1 border-[#c6acdd]"></div>
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="mb-1 pr-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="leading-[1.2]">
                      <p className="text-gray-800 pl-3 font-medium text-[14px] dark:text-gray-300">
                        <span className="font-semibold">{edu.institution} </span>
                      </p>
                      <p className="font-normal pl-6 text-[14px] text-gray-800 dark:text-gray-300">
                        {edu.degree}{edu.field && ','} {edu.field} {edu.gpa ? <p className="inline-block">, CGPA :&nbsp;</p> : ""}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{edu.gpa}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-[13px] font-medium text-gray-800 dark:text-gray-300">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SKILLS */}
        {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
          <div className="mb-2 pl-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[16px] text-[#a55fe1] font-bold">SKILLS</p>
              <div className="flex-1 border-t-[0.5px] mt-1 border-[#c6acdd]"></div>
            </div>
            {skills.technical?.length > 0 && (
              <p className="text-[14px] text-gray-800 dark:text-gray-300 pl-3">
                <span className="font-semibold">Technical Skill : </span> {skills.technical.join(", ")}
              </p>
            )}
            {skills.soft?.length > 0 && (
              <p className="text-[14px] pl-3">
                <span className="font-semibold text-gray-800 dark:text-gray-300">Soft Skill : </span> {skills.soft.join(", ")}
              </p>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && projects[0].title !== "" &&(
          <div className="mb-2 pl-1">
            <div className="flex items-center gap-2">
              <p className="text-[16px] text-[#a55fe1] font-bold mb-1">PROJECT</p>
              <div className="flex-1 border-t-[0.5px] mt-1 border-[#c6acdd]"></div>
            </div>
            {projects.map((p) => (
              <div key={p.id} className="mb-1">
                <div className="flex justify-between items-start pr-2">
                  <div className="flex justify-between items-center gap-3">
                    <p className="font-medium text-[14px] pl-3 text-gray-800 dark:text-gray-300">
                      <span className="font-semibold">{p.name}{p.name ? ' |' : ''} </span>
                    </p>
                    {p.technologies.length > 0 && (
                      <p className="text-[14px] text-black dark:text-gray-300">
                        {p.technologies.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-[13px] font-medium text-gray-800 dark:text-gray-300">
                    {formatDate(p.startDate)} - {formatDate(p.endDate)}
                  </div>
                </div>
                <div className="text-black dark:text-white text-[12px] text-justify pl-4 pr-2">
                  {p.description && (
                    <ul className="list-disc leading-4 text-[13px] text-black dark:text-gray-300 pl-5">
                      {p.description
                        .split(/(?<=\.)\s+(?=[A-Z])/g)
                        .filter(sentence => sentence.trim() !== "")
                        .map((sentence, index) => (
                          <li key={index} className="pl-1 text-left">{sentence.trim()}</li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {achievements.length > 0 && achievements[0].title !== "" &&(
          <div className="mt-2 pl-1 mb-2">
            <div className="flex items-center gap-2">
              <p className="text-[16px] text-[#a55fe1] font-bold mb-1">ACHIEVEMENTS</p>
              <div className="flex-1 border-t-[0.5px] mt-1 border-[#c6acdd]"></div>
            </div>

            {achievements.map((ach) => (
              <div key={ach.id} className="mb-1 pr-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="leading-[1.2]">
                      <p className="text-gray-800 pl-4 font-medium text-[14px] dark:text-gray-300">
                        <span className="font-semibold">{ach.title}</span>
                        {ach.description && (
                          <span className="font-normal pl-2 text-[14px] text-black dark:text-gray-300">
                            {ach.description && <span className="font-semibold pr-2">:</span>}
                            {ach.description}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CERTIFICATES */}
        {certificate.length > 0 && certificate[0].title !== "" && (
          <div className="mt-2 pl-1 mb-2">
            <div className="flex items-center gap-2">
              <p className="text-[16px] text-[#a55fe1] font-bold mb-1">CERTIFICATES</p>
              <div className="flex-1 border-t-[0.5px] mt-1 border-[#c6acdd]"></div>
            </div>

            {certificate.map((ach) => (
              <div key={ach.id} className="mb-1 pr-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="leading-[1.2]">
                      <p className="text-gray-800 pl-4 font-medium text-[14px] dark:text-gray-300">
                        <span className="font-semibold">{ach.title}</span>
                        {ach.description && (
                          <span className="font-normal pl-2 text-[14px] text-black dark:text-gray-300">
                            {ach.description && <span className="font-semibold pr-2">:</span>}
                            {ach.description}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </CardContent>
  </Card>
</div>
  )
}

