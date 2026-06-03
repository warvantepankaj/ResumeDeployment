"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/builder/components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/builder/components/ui/Card.jsx";
import { Eye, CheckCircle, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import { PersonalInfoForm } from "@/builder/components/ResumeBuilder/Forms/PersonalInfoForm.jsx";
import { ProfessionalSummaryForm } from "@/builder/components/ResumeBuilder/Forms/ProfessionalSummaryForm.jsx";
import { WorkExperienceForm } from "@/builder/components/ResumeBuilder/Forms/WorkExperienceForm.jsx";
import { EducationForm } from "@/builder/components/ResumeBuilder/Forms/EducationForm.jsx";
import { SkillsForm } from "@/builder/components/ResumeBuilder/Forms/SkillsForm.jsx";
import { ProjectsForm } from "@/builder/components/ResumeBuilder/Forms/ProjectsForm.jsx";
import { TemplateSelector } from "@/builder/components/ResumeBuilder/Forms/TemplateSelector.jsx";
import { PurpleResume } from "@/builder/components/ResumeBuilder/templates/PurpleResume.jsx";
import { B_WResume } from "@/builder/components/ResumeBuilder/templates/B_WResume.jsx";
import { AchivementForm } from "@/builder/components/ResumeBuilder/Forms/AchivementForm.jsx";
import { CertificationForm } from "@/builder/components/ResumeBuilder/Forms/CertificationsForm.jsx";
import { useToast } from "@/builder/hooks/use-toast";
import {
  retrieveExtractedData,
  mergeResumeData,
} from "@/builder/lib/data-transfer";
import axios from "axios";
import { ThemeToggle } from "@/builder/components/theme-toggle";
import { ClassicResume } from "../components/ResumeBuilder/templates/ClasscicResume";

const FORM_STEPS = [
  {
    id: "personal",
    title: "Personal Info",
    description: "Basic contact information",
  },
  {
    id: "summary",
    title: "Summary",
    description: "Brief overview of your career",
  },
  {
    id: "experience",
    title: "Work Experience",
    description: "Your professional background",
  },
  {
    id: "education",
    title: "Education",
    description: "Academic qualifications",
  },
  { id: "skills", title: "Skills", description: "Technical and soft skills" },
  {
    id: "projects",
    title: "Projects",
    description: "Notable projects (optional)",
  },
  { id: "achivement", title: "Achivements", description: "Your achivements" },
  {
    id: "certificate",
    title: "Certificates",
    description: "Your certificates",
  },
  {
    id: "template",
    title: "Templates",
    description: "Select your preferred design",
  },
  {
    id: "preview",
    title: "Preview",
    description: "Final review and export",
  },
];

export default function ResumeBuilderPage() {
  const scrollContainerRef = useRef(null);

  // const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState();
  const [dataTransferred, setDataTransferred] = useState(false);
  const { id: resumeId } = useParams();
  const navigate = useNavigate();
  // const { toast } = useToast();

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      profilePhotoURL: "",
      city: "",
      state: "",
      zipCode: "",
      linkedin: "",
      website: "",
    },
    professionalSummary: "",
    workExperience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
    },
    projects: [],
    achievements: [],
    certificate: [],
    selectedTemplate: "",
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/builder/resume/single/${resumeId}`,
        );

        setResumeData(res.data.data); // backend structure
        setCurrentStep(res.data.currentStep);
        setShowPreview(res.data.showPreview);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResume();
  }, [resumeId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const transferId = searchParams.get("transfer");

    if (transferId && !dataTransferred) {
      const extractedData = retrieveExtractedData(transferId);
      if (extractedData) {
        setResumeData((prevData) => mergeResumeData(prevData, extractedData));
        setDataTransferred(true);

        toast({
          title: "Data Loaded Successfully",
          description:
            "Your resume information has been pre-filled from the scorer analysis.",
        });
      } else {
        toast({
          title: "Transfer Failed",
          description: "Could not load the extracted data. Please try again.",
          variant: "destructive",
        });
      }
    }
    if (currentStep == 9) {
      setShowPreview(false);
    } else {
      setShowPreview(showPreview);
    }
  }, [dataTransferred, toast, currentStep, setShowPreview]);

  const updateResumeData = (section, data) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  // useEffect(() => {
  //   if (resumeData) {
  //     setCurrentStep(resumeData.currentStep ?? 0);
  //     setShowPreview(resumeData.showPreview ?? false);
  //   }
  // }, []);

  const nextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollContainerRef.current?.scrollTo(0, 0);
    }
    
    // if (currentStep == 8) setShowPreview(false);
  };

  const prevStep = () => {
    if (currentStep > 0){
      setCurrentStep(currentStep - 1);
      scrollContainerRef.current?.scrollTo(0, 0);
    }
  };

  const completeResume = async () => {
    try {
      await axios.put(`http://localhost:8000/builder/resume/${resumeId}`, {
        data: resumeData,
        status: "completed",
        progress: 100,
        currentStep: currentStep,
        showPreview: showPreview,
      });

      Swal.fire({
        title: "Resume Saved Successfully",
        icon: "success",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save resume.",
      });
    }
  };

  const progress = (currentStep / (FORM_STEPS.length - 1)) * 100;

  const currentTemplate = [
    {
      id: "modern",
      component: <PurpleResume resumeData={resumeData} />,
    },
    {
      id: "classic",
      component: <ClassicResume resumeData={resumeData} />,
    },
    {
      id: "creative",
      component: <B_WResume resumeData={resumeData} />,
    },
    {
      id: "minimal",
      component: <PurpleResume resumeData={resumeData} />,
    },
  ];

  const renderCurrentForm = () => {
    switch (FORM_STEPS[currentStep]?.id) {
      case "personal":
        return (
          <PersonalInfoForm
            data={resumeData?.personalInfo || {}}
            onUpdate={(data) => updateResumeData("personalInfo", data)}
          />
        );
      case "summary":
        return (
          <ProfessionalSummaryForm
            data={resumeData?.professionalSummary || ""}
            onUpdate={(data) => updateResumeData("professionalSummary", data)}
          />
        );
      case "experience":
        return (
          <WorkExperienceForm
            data={resumeData?.workExperience}
            onUpdate={(data) => updateResumeData("workExperience", data)}
          />
        );
      case "education":
        return (
          <EducationForm
            data={resumeData?.education}
            onUpdate={(data) => updateResumeData("education", data)}
          />
        );
      case "skills":
        return (
          <SkillsForm
            data={resumeData?.skills}
            onUpdate={(data) => updateResumeData("skills", data)}
          />
        );
      case "projects":
        return (
          <ProjectsForm
            data={resumeData?.projects}
            onUpdate={(data) => updateResumeData("projects", data)}
          />
        );
      case "achivement":
        return (
          <AchivementForm
            data={resumeData?.achievements}
            onUpdate={(data) => updateResumeData("achievements", data)}
          />
        );
      case "certificate":
        return (
          <CertificationForm
            data={resumeData?.certificate}
            onUpdate={(data) => updateResumeData("certificate", data)}
          />
        );
      case "template":
        return (
          <TemplateSelector
            selectedTemplate={resumeData?.selectedTemplate || "modern"}
            onSelect={(template) =>
              updateResumeData("selectedTemplate", template)
            }
            resumeData={resumeData}
          />
        );
      case "preview": {
        const selected = currentTemplate.find(
          (tem) => tem.id == resumeData?.selectedTemplate,
        );
        return (
          selected?.component || (
            <PurpleResume resumeData={resumeData || {}} length={progress} />
          )
        );
      }
      default:
        return null;
    }
  };

  const handleDownloadPDF = async () => {
    const toastId = toast.loading("Generating PDF...");
    try {
      const resumeElement = document.getElementById("printable-resume-content");

      if (!resumeElement) {
        toast.error("Please go to Preview step first.", { id: toastId });
        return;
      }

      // Convert all images to base64
      const images = resumeElement.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(async (img) => {
          if (!img.src || img.src.startsWith("data:")) return;
          try {
            const response = await fetch(img.src);
            const blob = await response.blob();
            const base64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
            img.src = base64;
          } catch {
            console.warn("Could not convert image:", img.src);
          }
        })
      );

      const response = await axios.post(
        "http://localhost:8000/builder/resume/export/pdf",
        { htmlContent: resumeElement.outerHTML },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume_${resumeId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.", { id: toastId });
    }
  };

  // const handleDownloadPDF = async () => {
  //   const toastId = toast.loading("Generating PDF...");
  //   try {
  //     // Get the resume element - works for both preview step and live preview
  //     const resumeElement = document.getElementById("printable-resume-content");

  //     if (!resumeElement) {
  //       toast.error("Resume content not found. Please go to Preview step first.", { id: toastId });
  //       return;
  //     }

  //     const response = await axios.post(
  //       "http://localhost:8000/builder/resume/export/pdf",
  //       { htmlContent: resumeElement.outerHTML },
  //       { responseType: "blob" }
  //     );

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `resume_${resumeId}.pdf`;
  //     a.click();
  //     window.URL.revokeObjectURL(url);

  //     toast.success("PDF downloaded!", { id: toastId });
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to generate PDF.", { id: toastId });
  //   }
  // };

  return (
    <div className="h-screen bg-[#f8f5f2] dark:bg-background overflow-hidden px-2">
      <div className="container mx-auto mt-20 py-8">
        {dataTransferred && currentStep === 0 && (
          <Card className="bg-purple-50 dark:bg-purple-900/20 max-w-4xl mx-auto mb-8 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-primary">
                    Data Successfully Loaded
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your resume information has been pre-filled from the ATS
                    analysis. Review and edit as needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div
          className={`grid gap-4 ${showPreview ? "lg:grid-cols-8" : "max-w-4xl mx-auto col-span-3"
            }`}
        >
          {
            <div
              className={`flex flex-col h-[80vh] w-full ${showPreview ? "col-span-4" : "col-span-8 mx-auto"
                }`}
            >
              {/* TOP (FIXED) */}
              <div className="flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-semibold">My Resume</h1>

                  <div className="flex items-center space-x-4 ">
                    {FORM_STEPS[currentStep]?.id != "preview" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="bg-transparent"
                      >
                        {showPreview ? (
                          <EyeOff className="h-4 w-4 mr-2" />
                        ) : (
                          <Eye className="h-4 w-4 mr-2" />
                        )}
                        {showPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex overflow-x-auto gap-1 pb-2 border-b scrollbar-hide">
                  {FORM_STEPS.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => {
                        setCurrentStep(index)
                        scrollContainerRef.current?.scrollTo(0, 0);
                      }
                      }
                      className={`px-2 py-1 rounded-md whitespace-nowrap text-sm transition
                                 ${currentStep === index
                          ? "bg-purple-600 text-white"
                          : "bg-muted text-muted-foreground hover:bg-purple-300"
                        }`}
                    >
                      {step.title}
                    </button>
                  ))}
                </div>
              </div>

              <div
                ref={scrollContainerRef}
                className={`flex-1 mt-6 pr-2 ${FORM_STEPS[currentStep]?.id === "preview"
                  ? "overflow-hidden w-auto flex justify-center items-start"
                  : "overflow-y-auto"
                  }`}
              >
                <Card
                  className={
                    FORM_STEPS[currentStep]?.id === "preview"
                      ? "w-full h-full p-4 "
                      : ""
                  }
                >
                  <CardContent
                    className={
                      FORM_STEPS[currentStep]?.id === "preview"
                        ? "p-0 flex justify-center"
                        : "p-6"
                    }
                  >
                    <div
                      className={
                        FORM_STEPS[currentStep]?.id === "preview"
                          ? "scale-[0.38] min-w-[84%] max-w-[84%] origin-top"
                          : ""
                      }
                    >
                      {renderCurrentForm()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-shrink-0 mt-4 flex items-center justify-between flex-wrap gap-3 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="bg-transparent hover:bg-purple-600 hover:text-white dark:hover:bg-purple-800"
                >
                  Previous
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={completeResume}
                    className="bg-purple-600 text-white hover:bg-purple-500"
                  >
                    Save
                  </Button>

                  <Button variant="outline" onClick={handleDownloadPDF}>PDF</Button>
                </div>

                <Button
                  onClick={nextStep}
                  disabled={currentStep === FORM_STEPS.length - 1}
                  className="bg-purple-600 text-white hover:bg-purple-500 dark:bg-purple-800"
                >
                  Next
                </Button>
              </div>
            </div>
          }

          {/* RIGHT PART (UNCHANGED) */}
          {showPreview && (
            <div className="lg:sticky lg:top-24 lg:h-fit col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                  <CardDescription>{ }</CardDescription>
                </CardHeader>

                <CardContent className="overflow-hidden max-h-[600px] ">
                  <div className="flex justify-center items-center w-full">
                    <div className={`origin-top scale-[0.49] w-full`}>
                      {currentTemplate?.find((template) => {
                        return template?.id === resumeData?.selectedTemplate;
                      })?.component || (
                          <PurpleResume
                            resumeData={resumeData}
                            length={progress}
                          />
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}