// "use client"

// import { useState } from "react"
// import { Button } from "@/builder/components/ui/Button"
// import { Input } from "@/builder/components/ui/Input"
// import { Label } from "@/builder/components/ui/Label"
// import { Badge } from "@/builder/components/ui/Badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/builder/components/ui/Card"
// import { Languages, Plus, X } from "lucide-react"

// export function SkillsForm({ data = {}, onUpdate }) {
//   // Ensure technical and soft are always arrays
//   const skillsData = {
//     technical: data.technical || [],
//     soft: data.soft || [],
//   }

//   const languageData ={
//     languages : data.languages || []
//   }

//   const [newTechnicalSkill, setNewTechnicalSkill] = useState("")
//   const [newSoftSkill, setNewSoftSkill] = useState("")
//   const [newLanguages,setNewLanguages] = useState("");

//   const addTechnicalSkill = () => {
//     if (newTechnicalSkill.trim()) {
//       onUpdate({
//         ...data,
//         technical: [...skillsData.technical, newTechnicalSkill.trim()],
//       })
//       setNewTechnicalSkill("")
//     }
//   }

//   const removeTechnicalSkill = (index) => {
//     onUpdate({
//       ...data,
//       technical: skillsData.technical.filter((_, i) => i !== index),
//     })
//   }

//   const addSoftSkill = () => {
//     if (newSoftSkill.trim()) {
//       onUpdate({
//         ...data,
//         soft: [...skillsData.soft, newSoftSkill.trim()],
//       })
//       setNewSoftSkill("")
//     }
//   }

//   const removeSoftSkill = (index) => {
//     onUpdate({
//       ...data,
//       soft: skillsData.soft.filter((_, i) => i !== index),
//     })
//   }

//   const addLanguages = () => {
//     onUpdate({
//       ...data,
//       languages:[...languageData.languages,newLanguages.trim()]
//     })
//     setNewLanguages("");
//   }

//   const removeLanguages = (index)=> {
//     onUpdate({
//       ...data,
//       languages:languageData.languages.filter((_,i) => i !== index)
//     })
//   }

//   const handleKeyPress = (e, type) => {
//     if (e.key === "Enter") {
//       e.preventDefault()
//       if (type === "technical") addTechnicalSkill()
//       else if(type==="soft") addSoftSkill()
//       else addLanguages()

//     }
//   }

//   return (
//     <div className="space-y-6 text-p ">
//       <Card className="bg-muted/30">
//         <CardHeader>
//           <CardTitle className="text-base">Skills Tips</CardTitle>
//         </CardHeader>
//         <CardContent className="text-sm text-muted-foreground space-y-2">
//           <p>• Include both technical and soft skills relevant to your target role</p>
//           <p>• Use specific technologies, tools, and programming languages</p>
//           <p>• Add skills that match job descriptions you are applying for</p>
//           <p>• Press Enter to add each skill quickly</p>
//         </CardContent>
//       </Card>

//       {/* Technical Skills */}
//       <div className="space-y-4">
//         <div>
//           <Label className="text-lg font-semibold">Technical Skills</Label>
//           <p className="text-sm text-muted-foreground">Programming languages, frameworks, tools, etc.</p>
//         </div>

//         <div className="flex space-x-2">
//           <Input
//             value={newTechnicalSkill}
//             onChange={(e) => setNewTechnicalSkill(e.target.value)}
//             onKeyPress={(e) => handleKeyPress(e, "technical")}
//             placeholder="e.g., React, Python, AWS"
//             className="flex-1"
//           />
//           <Button onClick={addTechnicalSkill} className={'bg-purple-600 hover:bg-purple-500 cursor-pointer'} disabled={!newTechnicalSkill.trim()}>
//             <Plus className="h-4 w-4 text-white" />
//           </Button>
//         </div>

//         {skillsData.technical.length > 0 && (
//           <div className="flex flex-wrap gap-2 ">
//             {skillsData.technical.map((skill, index) => (
//               <Badge key={index} variant="outline" className="text-sm">
//                 {skill}
//                 <button
//                   onClick={() => removeTechnicalSkill(index)}
//                   className="ml-2 hover:text-destructive"
//                   type="button"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </Badge>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Soft Skills */}
//       <div className="space-y-4">
//         <div>
//           <Label className="text-lg font-semibold">Soft Skills</Label>
//           <p className="text-sm text-muted-foreground">Communication, leadership, problem-solving, etc.</p>
//         </div>

//         <div className="flex space-x-2">
//           <Input
//             value={newSoftSkill}
//             onChange={(e) => setNewSoftSkill(e.target.value)}
//             onKeyPress={(e) => handleKeyPress(e, "soft")}
//             placeholder="e.g., Leadership, Communication"
//             className="flex-1"
//           />
//           <Button onClick={addSoftSkill} className={'bg-purple-600 hover:bg-purple-500 cursor-pointer'} disabled={!newSoftSkill.trim()}>
//             <Plus className="h-4 w-4 text-white" />
//           </Button>
//         </div>

//         {skillsData.soft.length > 0 && (
//           <div className="flex flex-wrap gap-2">
//             {skillsData.soft.map((skill, index) => (
//               <Badge key={index} variant="outline" className="text-sm">
//                 {skill}
//                 <button
//                   onClick={() => removeSoftSkill(index)}
//                   className="ml-2 hover:text-destructive"
//                   type="button"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </Badge>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Languges */}
//       <div className="space-y-4">
//         <div>
//           <Label className="text-lg font-semibold">Languages</Label>
//           <p className="text-sm text-muted-foreground">Hindi, English, Marathi, etc.</p>
//         </div>

//         <div className="flex space-x-2">
//           <Input
//             value={newLanguages}
//             onChange={(e) => setNewLanguages(e.target.value)}
//             onKeyPress={(e) => handleKeyPress(e, "language")}
//             placeholder="e.g., English, Marathi, Hindi"
//             className="flex-1"
//           />
//           <Button onClick={addLanguages} className={'bg-purple-600 hover:bg-purple-500 cursor-pointer'} disabled={!newLanguages.trim()}>
//             <Plus className="h-4 w-4 text-white" />
//           </Button>
//         </div>

//         {languageData.languages.length > 0 && (
//           <div className="flex flex-wrap gap-2">
//             {languageData.languages.map((language, index) => (
//               <Badge key={index} variant="outline" className="text-sm">
//                 {language}
//                 <button
//                   onClick={() => removeLanguages(index)}
//                   className="ml-2 hover:text-destructive"
//                   type="button"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </Badge>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client";

import { useState } from "react";
import { Button } from "@/builder/components/ui/Button";
import { Input } from "@/builder/components/ui/Input";
import { Label } from "@/builder/components/ui/Label";
import { Badge } from "@/builder/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/builder/components/ui/Card";
import { Languages, Plus, X } from "lucide-react";

export function SkillsForm({ data = {}, onUpdate }) {
  // Ensure technical is an object to avoid crashes if it was previously saved as an array
  const safeTechnical = Array.isArray(data.technical)
    ? {}
    : data.technical || {};

  const technicalData = {
    programmingLanguages: safeTechnical.programmingLanguages || [],
    frameworks: safeTechnical.frameworks || [],
    databases: safeTechnical.databases || [],
    tools: safeTechnical.tools || [],
  };

  const skillsData = {
    soft: data.soft || [],
  };

  const languageData = {
    languages: data.languages || [],
  };

  // State for Technical Skills Inputs
  const [techInputs, setTechInputs] = useState({
    programmingLanguages: "",
    frameworks: "",
    databases: "",
    tools: "",
  });

  // State for Soft Skills & Languages Inputs
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [newLanguages, setNewLanguages] = useState("");

  // --- TECHNICAL SKILLS HANDLERS ---
  const addTechSkill = (category) => {
    const value = techInputs[category].trim();
    if (value) {
      onUpdate({
        ...data,
        technical: {
          ...technicalData,
          [category]: [...technicalData[category], value],
        },
      });
      setTechInputs({ ...techInputs, [category]: "" });
    }
  };

  const removeTechSkill = (category, index) => {
    onUpdate({
      ...data,
      technical: {
        ...technicalData,
        [category]: technicalData[category].filter((_, i) => i !== index),
      },
    });
  };

  const handleTechInputChange = (category, value) => {
    setTechInputs((prev) => ({ ...prev, [category]: value }));
  };

  // --- SOFT SKILLS HANDLERS ---
  const addSoftSkill = () => {
    if (newSoftSkill.trim()) {
      onUpdate({
        ...data,
        soft: [...skillsData.soft, newSoftSkill.trim()],
      });
      setNewSoftSkill("");
    }
  };

  const removeSoftSkill = (index) => {
    onUpdate({
      ...data,
      soft: skillsData.soft.filter((_, i) => i !== index),
    });
  };

  // --- LANGUAGES HANDLERS ---
  const addLanguages = () => {
    if (newLanguages.trim()) {
      onUpdate({
        ...data,
        languages: [...languageData.languages, newLanguages.trim()],
      });
      setNewLanguages("");
    }
  };

  const removeLanguages = (index) => {
    onUpdate({
      ...data,
      languages: languageData.languages.filter((_, i) => i !== index),
    });
  };

  // --- KEYPRESS HANDLER ---
  const handleKeyPress = (e, type, category = null) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "technical" && category) addTechSkill(category);
      else if (type === "soft") addSoftSkill();
      else if (type === "language") addLanguages();
    }
  };

  // Configuration for mapping Technical Categories to keep JSX clean
  const TECH_CATEGORIES = [
    {
      key: "programmingLanguages",
      label: "Programming Languages",
      placeholder: "e.g., Python, Java, C++",
    },
    {
      key: "frameworks",
      label: "Frameworks & Libraries",
      placeholder: "e.g., React, Django, Node.js",
    },
    {
      key: "databases",
      label: "Databases",
      placeholder: "e.g., MongoDB, PostgreSQL, MySQL",
    },
    {
      key: "tools",
      label: "Tools & Platforms",
      placeholder: "e.g., Git, Docker, AWS",
    },
  ];

  return (
    <div className="space-y-6 text-p ">
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Skills Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            • Include both technical and soft skills relevant to your target
            role
          </p>
          <p>
            • Categorize your technical expertise to make it easily scannable
          </p>
          <p>• Add skills that match job descriptions you are applying for</p>
          <p>• Press Enter to add each skill quickly</p>
        </CardContent>
      </Card>

      {/* Technical Skills Section */}
      <div className="space-y-6">
        <div>
          <Label className="text-lg font-semibold">Technical Skills</Label>
          <p className="text-sm text-muted-foreground">
            Categorize your technical proficiencies.
          </p>
        </div>

        <div className="grid gap-6 pl-2 border-l-2 border-muted">
          {TECH_CATEGORIES.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-3 pl-2">
              <Label className="text-sm font-medium text-foreground">
                {label}
              </Label>
              <div className="flex space-x-2">
                <Input
                  value={techInputs[key]}
                  onChange={(e) => handleTechInputChange(key, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, "technical", key)}
                  placeholder={placeholder}
                  className="flex-1"
                />
                <Button
                  onClick={() => addTechSkill(key)}
                  className={"bg-purple-600 hover:bg-purple-500 cursor-pointer"}
                  disabled={!techInputs[key].trim()}
                >
                  <Plus className="h-4 w-4 text-white" />
                </Button>
              </div>

              {technicalData[key].length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {technicalData[key].map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                      <button
                        onClick={() => removeTechSkill(key, index)}
                        className="ml-2 hover:text-destructive"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="border-muted" />

      {/* Soft Skills Section */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Soft Skills</Label>
          <p className="text-sm text-muted-foreground">
            Communication, leadership, problem-solving, etc.
          </p>
        </div>

        <div className="flex space-x-2">
          <Input
            value={newSoftSkill}
            onChange={(e) => setNewSoftSkill(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, "soft")}
            placeholder="e.g., Leadership, Communication"
            className="flex-1"
          />
          <Button
            onClick={addSoftSkill}
            className={"bg-purple-600 hover:bg-purple-500 cursor-pointer"}
            disabled={!newSoftSkill.trim()}
          >
            <Plus className="h-4 w-4 text-white" />
          </Button>
        </div>

        {skillsData.soft.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skillsData.soft.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {skill}
                <button
                  onClick={() => removeSoftSkill(index)}
                  className="ml-2 hover:text-destructive"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <hr className="border-muted" />

      {/* Languages Section */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Languages</Label>
          <p className="text-sm text-muted-foreground">
            English, Spanish, Hindi, etc.
          </p>
        </div>

        <div className="flex space-x-2">
          <Input
            value={newLanguages}
            onChange={(e) => setNewLanguages(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, "language")}
            placeholder="e.g., English, Marathi, Hindi"
            className="flex-1"
          />
          <Button
            onClick={addLanguages}
            className={"bg-purple-600 hover:bg-purple-500 cursor-pointer"}
            disabled={!newLanguages.trim()}
          >
            <Plus className="h-4 w-4 text-white" />
          </Button>
        </div>

        {languageData.languages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {languageData.languages.map((language, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {language}
                <button
                  onClick={() => removeLanguages(index)}
                  className="ml-2 hover:text-destructive"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
