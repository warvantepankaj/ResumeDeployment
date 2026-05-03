import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { scoreAPI, resumeAPI } from "../services/api";
import FileDropZone from "../components/FileDropZone";
import { BsCloudUploadFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";


import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Sparkles,
  Database,
} from "lucide-react";
import Swal from "sweetalert2";
import ScoreLoader from "../Loaders/ScoreLoader";

export default function ResumeScorer() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const [source, setSource] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(null);
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedCat, setExpandedCat] = useState(null);
  const [savedResumes, setSavedResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  useEffect(() => {
    if (source === "database" && isSignedIn) fetchSavedResumes();
  }, [source, isSignedIn]);

  const fetchSavedResumes = async () => {
    setLoadingResumes(true);
    try {
      const res = await resumeAPI.getAll();
      setSavedResumes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleFileScore = async (f) => {
    setFile(f);
    setScoring(true);

    try {
      const res = await scoreAPI.scoreFile(f);
      setResult(res.data);

      try {
        const parseRes = await scoreAPI.parseForScoring(f);
        setParsedData(parseRes.data.data);
      } catch {}
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Scoring Failed",
      });
      setOpenModal(false)
    } finally {
      setFile(null);
      setScoring(false);
    }
  };

  const handleDBScore = async (resumeId) => {

    setScoring(true);

    try {
      const res = await scoreAPI.scoreFromDB(resumeId);
      setResult(res.data);
    } catch (err) {
       Swal.fire({
        icon: "error",
        title: "Scoring Failed",
      });
    } finally {
      setScoring(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setSource(null);
    setExpandedCat(null);
    setParsedData(null);
  };

  const handleAutofill = () => {
    navigate("/resume-builder/new", { state: { parsedData } });
  };

const getScoreColor = (score) => {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-rose-500";
};

const getScoreRingColor = (score) => {
  if (score >= 80) return "#10b981";   // emerald-500
  if (score >= 60) return "#f59e0b";   // amber-500
  return "#f43f5e";                    // rose-500
};

const getScoreBg = (score) => {
  if (score >= 80) return "rgba(16, 185, 129, 0.12)";
  if (score >= 60) return "rgba(245, 158, 11, 0.12)";
  return "rgba(244, 63, 94, 0.12)";
};

  // Score result view
  if (result) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 mt-5 bg-[#faf5ee] dark:bg-gray-800/60">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in-up">
            <h1 className="text-3xl font-bold dark:text-white mb-2">
              Resume Analysis Complete
            </h1>
            <p className="text-surface-400">{result.summary}</p>
          </div>

          {/* Overall Score */}
          <div
            className="glass-card bg-[#f4eee6] p-8 mb-8 text-center animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={getScoreRingColor(result.overall_score)}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - result.overall_score / 100)}`}
                  className="transition-all duration-1000 ease-out "
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-4xl font-black ${getScoreColor(result.overall_score)}`}
                >
                  {result.overall_score}
                </span>
                <span className="text-xs text-surface-400">out of 100</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              {result.ats_friendly ? (
                <span className="inline-flex items-center  gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                  <Shield size={14} /> ATS Friendly
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertTriangle size={14} /> Not ATS Optimized
                </span>
              )}
            </div>
          </div>

          {/* Category Scores */}
          <div className="space-y-3 mb-8 ">
            {result.categories?.map((cat, i) => (
              <div
                key={i}
                className="glass-card overflow-hidden animate-fade-in-up bg-[#f5efe6] dark:text-white"
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
              >
                <button
                  onClick={() => setExpandedCat(expandedCat === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 bg-transparent border-none cursor-pointer text-left"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: getScoreBg(cat.score) }}
                    >
                      <Target size={18} className={getScoreColor(cat.score)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium dark:text-white text-sm">
                          {cat.name}
                        </span>
                        <span
                          className={`font-bold text-sm ${getScoreColor(cat.score)}`}
                        >
                          {cat.score}/100
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${cat.score}%`,
                            background: getScoreRingColor(cat.score),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <span className="ml-4 text-surface-500">
                    {expandedCat === i ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </span>
                </button>

                {expandedCat === i && (
                  <div className="px-5 pb-5 border-t border-surface-800/50 pt-4">
                    <p className="text-surface-300 text-sm mb-3">
                      {cat.feedback}
                    </p>
                    {cat.suggestions?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-surface-400 mb-2 uppercase tracking-wide">
                          Suggestions
                        </p>
                        <ul className="space-y-1.5">
                          {cat.suggestions.map((s, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 text-sm text-surface-300"
                            >
                              <Sparkles
                                size={14}
                                className="text-primary-400 mt-0.5 shrink-0"
                              />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div
              className="glass-card p-6 animate-fade-in-up bg-[#f4eee6]"
              style={{ animationDelay: "0.5s" }}
            >
              <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-400 mb-4">
                <TrendingUp size={20} /> Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths?.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-surface-300"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-emerald-400 mt-0.5 shrink-0"
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="glass-card p-6 animate-fade-in-up bg-[#f4eee6]"
              style={{ animationDelay: "0.55s" }}
            >
              <h3 className="flex items-center gap-2 text-lg font-bold text-red-400 mb-4">
                <TrendingDown size={20} /> Areas to Improve
              </h3>
              <ul className="space-y-2">
                {result.weaknesses?.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-surface-300"
                  >
                    <XCircle
                      size={16}
                      className="text-red-400 mt-0.5 shrink-0"
                    />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (
            <div
              className="glass-card p-6 mb-8 animate-fade-in-up bg-[#f4eee6]"
              style={{ animationDelay: "0.6s" }}
            >
              <h3 className="flex items-center gap-2 text-lg font-bold text-primary-400 mb-4">
                <Sparkles size={20} /> Recommendations
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.recommendations.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 rounded-lg bg-primary-600/5 border border-primary-500/10 text-sm text-surface-300"
                  >
                    <span className="text-primary-400 font-bold text-xs mt-0.5">
                      {i + 1}.
                    </span>
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            <button
              onClick={handleReset}
              className="btn-secondary cursor-pointer"
            >
              <RefreshCw size={18} /> Score Another Resume
            </button>
            {parsedData && (
              <button
                onClick={handleAutofill}
                className="btn-primary cursor-pointer"
              >
                <FileText size={18} /> Autofill Builder Form{" "}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Scoring loader
  if (scoring) {
    return (
      <div className="h-screen flex items-center justify-center px-4 overflow-hidden bg-[#faf5ee] dark:bg-gray-800/60">
        <div className="text-center">
          {/* <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-surface-800" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-400 animate-spin" />
            <BarChart3
              size={32}
              className="absolute inset-0 m-auto text-primary-400"
            />
          </div> */}
          <ScoreLoader/>
          <h2 className="text-xl font-bold dark:text-white mb-2">
            Analyzing Your Resume
          </h2>
          <p className="text-surface-400 text-sm">
            Our AI is reviewing your resume across multiple criteria...
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Loader2 size={16} className="text-primary-400 animate-spin" />
            <span className="text-xs text-surface-500">
              This may take up to 30 seconds
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Choosing source screen
  if (!source) {
    return (
      <div className="min-h-screen pt-24 mt-10 pb-12 px-4 bg-[#faf5ee] dark:bg-gray-800/60">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              <span className="dark:text-white">Resume Scorer</span>
            </h1>
            <p className="text-surface-400">
              Get AI-powered analysis and a detailed score for your resume.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div
              // onClick={() => setSource("upload")}
              onClick={() => setOpenModal(true)}
              className="glass-card-hover p-8 text-center cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <BsCloudUploadFill size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">
                Upload Resume
              </h3>
              <p className="text-surface-400 text-sm">
                Drop a resume file (PDF, DOCX, TXT) to score it.
              </p>
            </div>

            <div
              onClick={() => {
                setSource("database");
              }}
              className="glass-card-hover p-8 text-center cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mx-auto mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Database size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">
                From My Resumes
              </h3>
              <p className="text-surface-400 text-sm">
                Score a resume you've previously built and saved.
              </p>
            </div>
          </div>
        </div>

        {openModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm "
            onClick={() => setOpenModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl px-10 py-7 rounded-2xl bg-[#faf5ee] dark:bg-gray-900 shadow-2xl animate-fade-in-up"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold dark:text-white">
                  Score Your Resume
                </h2>

                <button
                  onClick={() => setOpenModal(false)}
                  className="text-gray-500 hover:text-red-500"
                >
                 <RxCross2 size={28} className="font-bold" />
                </button>
              </div>

              <FileDropZone
                onFileDrop={handleFileScore}
                file={file}
                onClear={() => setFile(null)}
                label="Drop your resume here to score it"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Upload source

  // if (source === "upload") {
  //   return (
  //     <div className="min-h-screen pt-24 pb-12 px-4 bg-[#faf5ee] dark:bg-gray-800/60">
  //       <div className="max-w-xl mx-auto">
  //         <button
  //           onClick={() => setSource(null)}
  //           className="flex items-center gap-1 text-surface-400 dark:text-white mb-6 bg-transparent border-none cursor-pointer text-sm"
  //         >
  //           <ChevronDown size={18} className="rotate-90" /> Back
  //         </button>
  //         <h1 className="text-2xl font-bold mb-2 dark:text-white">
  //           Score Your Resume
  //         </h1>
  //         <FileDropZone
  //           onFileDrop={handleFileScore}
  //           file={file}
  //           onClear={() => setFile(null)}
  //           label="Drop your resume here to score it"
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  // Database source
  if (source === "database") {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-[#faf5ee] dark:bg-gray-800/60">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSource(null)}
            className="flex items-center gap-1 text-surface-400 dark:text-white  mb-6 bg-transparent border-none cursor-pointer text-sm"
          >
            <ChevronDown size={18} className="rotate-90" /> Back
          </button>
          <h1 className="text-2xl font-bold mb-2 gradient-text">
            Score a Saved Resume
          </h1>
          <p className="text-surface-400 text-sm mb-8">
            Select one of your saved resumes to score.
          </p>

          {loadingResumes ? (
            <div className="text-center py-12">
              <Loader2
                size={32}
                className="text-primary-400 animate-spin mx-auto mb-3"
              />
              <p className="text-surface-400 text-sm">
                Loading your resumes...
              </p>
            </div>
          ) : savedResumes.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <Database size={48} className="text-surface-600 mx-auto mb-4" />
              <p className="text-surface-300 mb-2">No saved resumes found</p>
              <p className="text-surface-500 text-sm mb-4">
                Build a resume first, then come back to score it.
              </p>
              <button
                onClick={() => navigate("/builder")}
                className="btn-primary text-sm cursor-pointer"
              >
                <FileText size={16} /> Build a Resume
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedResumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => handleDBScore(resume.id)}
                  className="glass-card-hover p-5 cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-600/15 flex items-center justify-center">
                      <FileText size={18} className="text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {resume.title}
                      </h3>
                      <p className="text-xs text-surface-500">
                        Updated{" "}
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-surface-500 group-hover:text-primary-400 transition-colors"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
