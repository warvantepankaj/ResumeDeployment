"use client";

import { useState, useEffect } from "react";
import { Button } from "@/builder/components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/builder/components/ui/Card.jsx";
import {  Eye, CheckCircle, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

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
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [dataTransferred, setDataTransferred] = useState(false);
  const { id: resumeId } = useParams();
  const navigate = useNavigate();
  console.log(resumeId, "resumeIdresumeId");

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
      } catch (err) {
        console.error(err);
      }
    };

    fetchResume();
  }, [resumeId]);

  // Initialize currentStep from localStorage
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("currentStep");
    return savedStep ? Number(savedStep) : 0;
  });

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

  const nextStep = () => {
    if (currentStep < FORM_STEPS.length - 1) setCurrentStep(currentStep + 1);
    // if (currentStep == 8) setShowPreview(false);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const completeResume = async () => {
    try {
      await axios.put(`http://localhost:8000/builder/resume/${resumeId}`, {
        data: resumeData,
        status: "completed",
        progress: 100,
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
      component: <PurpleResume resumeData={resumeData} length={progress} />,
    },
    {
      id: "classic",
      component: <B_WResume resumeData={resumeData} length={progress} />,
    },
    {
      id: "creative",
      component: <PurpleResume resumeData={resumeData} length={progress} />,
    },
    {
      id: "minimal",
      component: <PurpleResume resumeData={resumeData} length={progress} />,
    },
  ];

  const renderCurrentForm = () => {
    switch (FORM_STEPS[currentStep].id) {
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
            selectedTemplate={resumeData?.selectedTemplate}
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
          className={`grid gap-8 ${
            showPreview ? "lg:grid-cols-8" : "max-w-4xl mx-auto col-span-3"
          }`}
        >
          <div
            className={`flex flex-col h-[80vh] w-full ${
              showPreview ? "col-span-4" : "col-span-8 mx-auto"
            }`}
          >
            {/* TOP (FIXED) */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">My Resume</h1>

                <div className="flex items-center space-x-4 ">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      currentStep === FORM_STEPS.length - 1
                        ? setShowPreview(false)
                        : setShowPreview(!showPreview)
                    }
                    className="bg-transparent "
                  >
                   { showPreview ? 
                     <EyeOff className="h-4 w-4 mr-2" /> :
                    <Eye className="h-4 w-4 mr-2" />
                  }
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                </div>
              </div>

              <div className="flex overflow-x-auto gap-1 pb-2 border-b scrollbar-hide">
                {FORM_STEPS.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`px-2 py-1 rounded-md whitespace-nowrap text-sm transition
          ${
            currentStep === index
              ? "bg-purple-600 text-white"
              : "bg-muted text-muted-foreground hover:bg-purple-300"
          }`}
                  >
                    {step.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-6 pr-2">
              <Card>
                <CardContent className="p-6">{renderCurrentForm()}</CardContent>
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

                <Button variant="outline">PDF</Button>
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

          {/* RIGHT PART (UNCHANGED) */}
          {showPreview && (
            <div className="lg:sticky lg:top-24 lg:h-fit col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                  <CardDescription>{}</CardDescription>
                </CardHeader>

                <CardContent className="overflow-hidden max-h-[600px] ">
                  <div className="w-auto flex justify-center items-start">
                    <div className="origin-top scale-[0.62] w-full">
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

// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/builder/components/ui/Button.jsx";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/builder/components/ui/Card.jsx";
// import { Badge } from "@/builder/components/ui/Badge.jsx";
// // import { Progress } from "@//components/ui/Progress.jsx";
// import { ArrowLeft, Eye, CheckCircle } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import Swal from "sweetalert2";

// import { PersonalInfoForm } from "@/builder/components/ResumeBuilder/Forms/PersonalInfoForm.jsx";
// import { ProfessionalSummaryForm } from "@/builder/components/ResumeBuilder/Forms/ProfessionalSummaryForm.jsx";
// import { WorkExperienceForm } from "@/builder/components/ResumeBuilder/Forms/WorkExperienceForm.jsx";
// import { EducationForm } from "@/builder/components/ResumeBuilder/Forms/EducationForm.jsx";
// import { SkillsForm } from "@/builder/components/ResumeBuilder/Forms/SkillsForm.jsx";
// import { ProjectsForm } from "@/builder/components/ResumeBuilder/Forms/ProjectsForm.jsx";
// import { TemplateSelector } from "@/builder/components/ResumeBuilder/Forms/TemplateSelector.jsx";
// import { PurpleResume } from "@/builder/components/ResumeBuilder/templates/PurpleResume.jsx";
// import { B_WResume } from "@/builder/components/ResumeBuilder/templates/B_WResume.jsx";
// import { AchivementForm } from "@/builder/components/ResumeBuilder/Forms/AchivementForm.jsx";
// import { CertificationForm } from "@/builder/components/ResumeBuilder/Forms/CertificationsForm.jsx";
// import { useToast } from "@/builder/hooks/use-toast";
// import {
//   retrieveExtractedData,
//   mergeResumeData,
// } from "@/builder/lib/data-transfer";
// import axios from "axios";
// import { ThemeToggle } from "@/builder/components/theme-toggle";

// const FORM_STEPS = [
//   {
//     id: "personal",
//     title: "Personal Info",
//     description: "Basic contact information",
//   },
//   {
//     id: "summary",
//     title: "Professional Summary",
//     description: "Brief overview of your career",
//   },
//   {
//     id: "experience",
//     title: "Work Experience",
//     description: "Your professional background",
//   },
//   {
//     id: "education",
//     title: "Education",
//     description: "Academic qualifications",
//   },
//   { id: "skills", title: "Skills", description: "Technical and soft skills" },
//   {
//     id: "projects",
//     title: "Projects",
//     description: "Notable projects (optional)",
//   },
//   { id: "achivement", title: "Achivements", description: "Your achivements" },
//   {
//     id: "certificate",
//     title: "Certificates",
//     description: "Your certificates",
//   },
//   {
//     id: "template",
//     title: "Choose Template",
//     description: "Select your preferred design",
//   },
//   {
//     id: "preview",
//     title: "Preview & Download",
//     description: "Final review and export",
//   },
// ];

// export default function ResumeBuilderPage() {
//   const { toast } = useToast();
//   const [showPreview, setShowPreview] = useState(false);
//   const [dataTransferred, setDataTransferred] = useState(false);
//   const { id: resumeId } = useParams();
//   const navigate = useNavigate();

//   const [resumeData, setResumeData] = useState({
//     personalInfo: {
//       firstName: "",
//       middleName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       address: "",
//       profilePhotoURL: "",
//       city: "",
//       state: "",
//       zipCode: "",
//       linkedin: "",
//       website: "",
//     },
//     professionalSummary: "",
//     workExperience: [],
//     education: [],
//     skills: {
//       technical: [],
//       soft: [],
//       languages: [],
//     },
//     projects: [],
//     achievements: [],
//     certificate: [],
//     selectedTemplate: "",
//   });

//   useEffect(() => {
//     const fetchResume = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:8000/resume/single/${resumeId}`,
//         );

//         setResumeData(res.data.data); // backend structure
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchResume();
//   }, [resumeId]);

//   // Initialize currentStep from localStorage
//   const [currentStep, setCurrentStep] = useState(() => {
//     const savedStep = localStorage.getItem("currentStep");
//     return savedStep ? Number(savedStep) : 0;
//   });

//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const transferId = searchParams.get("transfer");

//     if (transferId && !dataTransferred) {
//       const extractedData = retrieveExtractedData(transferId);
//       if (extractedData) {
//         setResumeData((prevData) => mergeResumeData(prevData, extractedData));
//         setDataTransferred(true);

//         toast({
//           title: "Data Loaded Successfully",
//           description:
//             "Your resume information has been pre-filled from the scorer analysis.",
//         });
//       } else {
//         toast({
//           title: "Transfer Failed",
//           description: "Could not load the extracted data. Please try again.",
//           variant: "destructive",
//         });
//       }
//     }
//     if (currentStep == 9) {
//       setShowPreview(false);
//     } else {
//       setShowPreview(showPreview);
//     }
//   }, [dataTransferred, toast, currentStep, setShowPreview]);

//   const updateResumeData = (section, data) => {
//     setResumeData((prev) => ({
//       ...prev,
//       [section]: data,
//     }));
//   };

//   const nextStep = () => {
//     if (currentStep < FORM_STEPS.length - 1) setCurrentStep(currentStep + 1);
//     // if (currentStep == 8) setShowPreview(false);
//   };

//   const prevStep = () => {
//     if (currentStep > 0) setCurrentStep(currentStep - 1);
//   };

//   const completeResume = async () => {
//     try {
//       await axios.put(`http://localhost:8000/builder/resume/${resumeId}`, {
//         data: resumeData,
//         status: "completed",
//         progress: 100,
//       });

//       Swal.fire({
//         title: "Resume created!",
//         icon: "success",
//       });
//       navigate("/dashboard");
//     } catch (error) {
//       console.error(error);
//       toast({
//         title: "Error",
//         description: "Failed to save resume.",
//       });
//     }
//   };

//   const progress = (currentStep / (FORM_STEPS.length - 1)) * 100;

//   const currentTemplate = [
//     {
//       id: "modern",
//       component: <PurpleResume resumeData={resumeData} length={progress} />,
//     },
//     {
//       id: "classic",
//       component: <B_WResume resumeData={resumeData} length={progress} />,
//     },
//     {
//       id: "creative",
//       component: <PurpleResume resumeData={resumeData} length={progress} />,
//     },
//     {
//       id: "minimal",
//       component: <PurpleResume resumeData={resumeData} length={progress} />,
//     },
//   ];

//   const renderCurrentForm = () => {
//     switch (FORM_STEPS[currentStep].id) {
//       case "personal":
//         return (
//           <PersonalInfoForm
//             data={resumeData?.personalInfo || {}}
//             onUpdate={(data) => updateResumeData("personalInfo", data)}
//           />
//         );
//       case "summary":
//         return (
//           <ProfessionalSummaryForm
//             data={resumeData?.professionalSummary || ""}
//             onUpdate={(data) => updateResumeData("professionalSummary", data)}
//           />
//         );
//       case "experience":
//         return (
//           <WorkExperienceForm
//             data={resumeData?.workExperience}
//             onUpdate={(data) => updateResumeData("workExperience", data)}
//           />
//         );
//       case "education":
//         return (
//           <EducationForm
//             data={resumeData?.education}
//             onUpdate={(data) => updateResumeData("education", data)}
//           />
//         );
//       case "skills":
//         return (
//           <SkillsForm
//             data={resumeData?.skills}
//             onUpdate={(data) => updateResumeData("skills", data)}
//           />
//         );
//       case "projects":
//         return (
//           <ProjectsForm
//             data={resumeData?.projects}
//             onUpdate={(data) => updateResumeData("projects", data)}
//           />
//         );
//       case "achivement":
//         return (
//           <AchivementForm
//             data={resumeData?.achievements}
//             onUpdate={(data) => updateResumeData("achievements", data)}
//           />
//         );
//       case "certificate":
//         return (
//           <CertificationForm
//             data={resumeData?.certificate}
//             onUpdate={(data) => updateResumeData("certificate", data)}
//           />
//         );
//       case "template":
//         return (
//           <TemplateSelector
//             selectedTemplate={resumeData?.selectedTemplate}
//             onSelect={(template) =>
//               updateResumeData("selectedTemplate", template)
//             }
//             resumeData={resumeData}
//           />
//         );
//       case "preview":
//         const selected = currentTemplate.find(
//           (tem) => tem.id == resumeData?.selectedTemplate,
//         );
//         return (
//           selected?.component || (
//             <PurpleResume resumeData={resumeData || {}} length={progress} />
//           )
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen px-20">
//       {/* Header */}
//       <header className="border-b bg-card/50 backdrop-blur-sm sticky top-20 z-40 ">
//         <div className="container mx-auto pt-2 pb-5">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <a href="/">
//                 <Button variant="ghost" size="sm">
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back to Home
//                 </Button>
//               </a>
//               <div className="flex items-center space-x-2">
//                 {dataTransferred && (
//                   <Badge variant="default" className="ml-2">
//                     <CheckCircle className="h-3 w-3 mr-1" />
//                     Data Loaded
//                   </Badge>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center space-x-4 ">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   currentStep === FORM_STEPS.length - 1
//                     ? setShowPreview(false)
//                     : setShowPreview(!showPreview)
//                 }
//                 className="bg-transparent "
//               >
//                 <Eye className="h-4 w-4 mr-2" />
//                 {showPreview ? "Hide Preview" : "Show Preview"}
//               </Button>

//             </div>
//           </div>

//           <div className="mt-2">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium">
//                 Step {currentStep + 1} of {FORM_STEPS.length}
//               </span>
//               <span className="text-sm text-muted-foreground">
//                 {Math.round(progress)}% Complete
//               </span>
//             </div>

//             <div className="relative h-4 ">
//               <div className="absolute top-1/2 pr-3 left-0 right-0  w-full h-2 -translate-y-1/2 bg-gray-300 dark:bg-gray-400 rounded-full">
//                 <div
//                   className="h-2 bg-purple-600 dark:bg-purple-700 rounded-full"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>

//               {FORM_STEPS.map((step, index) => {
//                 const leftPercent = (index / (FORM_STEPS.length - 1)) * 100;

//                 return (
//                   <div
//                     key={step.id}
//                     className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
//                     style={{
//                       left: `${leftPercent}%`,
//                       transform: "translate(-50%, -50%)",
//                     }}
//                   >
//                     <button
//                       onClick={() => setCurrentStep(index)}
//                       className={`absolute top-1/2 w-4 h-4 rounded-full border-2 border-purple-600 -translate-x-1/2 -translate-y-1/2
//                       ${currentStep === index ? "bg-purple-600" : "bg-white"}
//                        transition-colors`}
//                     />

//                     <span className="mt-9 text-xs text-center whitespace-nowrap">
//                       {step.id.toUpperCase()}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto mt-20 py-8">
//         {dataTransferred && currentStep === 0 && (
//           <Card className="bg-purple-50 dark:bg-purple-900/20 max-w-4xl mx-auto mb-8 bg-primary/5 border-primary/20">
//             <CardContent className="pt-6">
//               <div className="flex items-center space-x-3">
//                 <CheckCircle className="h-5 w-5 text-primary" />
//                 <div>
//                   <h3 className="font-semibold text-primary">
//                     Data Successfully Loaded
//                   </h3>
//                   <p className="text-sm text-muted-foreground">
//                     Your resume information has been pre-filled from the ATS
//                     analysis. Review and edit as needed.
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         <div
//           className={`grid gap-8 ${showPreview ? "lg:grid-cols-7" : "max-w-4xl mx-auto"}`}
//         >
//           <div className="space-y-6 col-span-3">
//             <div className="text-center lg:text-left">
//               <Badge
//                 variant="secondary"
//                 className="mb-2 bg-purple-600 dark:bg-purple-800 text-white"
//               >
//                 {FORM_STEPS[currentStep].id}
//               </Badge>
//               <h2 className="text-2xl font-bold mb-2 text-purple-700">
//                 {FORM_STEPS[currentStep].title}
//               </h2>
//               <p className="text-muted-foreground">
//                 {FORM_STEPS[currentStep].description}
//               </p>
//             </div>

//             <Card>
//               <CardContent className="p-6">{renderCurrentForm()}</CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 onClick={prevStep}
//                 disabled={currentStep === 0}
//                 className="bg-transparent hover:bg-purple-600 hover:text-white dark:dark:text-white dark:hover:bg-purple-800 "
//               >
//                 Previous
//               </Button>

//               {currentStep === FORM_STEPS.length - 1 ? (
//                 <Button
//                   onClick={completeResume}
//                   className={"bg-purple-600 text-white hover:bg-purple-500 "}
//                 >
//                   Complete
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={nextStep}
//                   className={
//                     "bg-purple-600 text-white hover:bg-purple-500 dark:bg-purple-800 "
//                   }
//                 >
//                   Next Step
//                 </Button>
//               )}
//             </div>
//           </div>

//           {showPreview && (
//             <div className="lg:sticky lg:top-24 lg:h-fit col-span-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Live Preview</CardTitle>
//                   <CardDescription>{}</CardDescription>
//                 </CardHeader>

//                 <CardContent className="overflow-hidden">
//                   <div className="w-full flex justify-center items-start">
//                     <div className="origin-top scale-[0.6] w-[1200px]">
//                       {currentTemplate?.find((template) => {
//                         return template?.id === resumeData?.selectedTemplate;
//                       })?.component || (
//                         <PurpleResume
//                           resumeData={resumeData}
//                           length={progress}
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
