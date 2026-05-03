import { FileText, ClipboardCheck } from "lucide-react";
// import useDarkMode from "../hooks/useDarkMode.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import ResumeNameModal from "../modal/ResumeNameModal.jsx";
import { useEffect, useState } from "react";

export default function Home() {
  // const [theme, setTheme] = useDarkMode();
  const [openModal, setOpenModal] = useState(false);
  const [tick, setTick] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { openSignIn } = useClerk();

  const handleStartBuilding = () => {
    if (!isSignedIn) {
      openSignIn();
    } else {
      setOpenModal(true);
    }
  };

  useEffect(() => {
    let frame;
    const animate = () => {
      setTick((t) => t + 0.03);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleCreateResume = (name) => {

    if (!isSignedIn) {
      openSignIn();
    } else {
      navigate("/resume-builder", { state: { name } });
    }
  };

  const handleCheckScore = () => {
  if (!isSignedIn) {
    openSignIn();
  } else {
    navigate("/score"); 
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-[#faf5ee] dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen px-6 lg:px-24">
        {/* LEFT SIDE (UNCHANGED) */}
        <section className="flex flex-col items-center lg:items-start text-center lg:text-left mt-10 py-10 flex-1 dark:bg-gray-900 ">
          <div className="bg-purple-600  mb-5  text-white dark:bg-gray-800 text-sm font-medium px-3 py-1 rounded-full self-center">
            Professional Resume Tools
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl leading-relaxed font-bold text-center"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Build a polished resume <br />
            <span className="text-[#c07a3a] italic">in minutes</span> with AI  <br />
           that feels like a personal career atelier
          </h1>

          <p className="my-8 font-normal self-center text-gray-600 text-lg lg:text-xl dark:text-gray-300 max-w-2xl text-center">
            Create professional resumes with our intuitive builder and analyze
            your existing resume with our ATS scoring system. Get hired faster
            with optimized resumes.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-4 font-semibold self-center">
            <button
              onClick={handleStartBuilding}
              className="bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-lg text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
            >
              <FileText size={18} /> Start Building Resume
            </button>

            <ResumeNameModal
              isOpen={openModal}
              onClose={() => setOpenModal(false)}
              onCreate={handleCreateResume}
            />

            <button
              onClick={handleCheckScore}
              className="border border-gray-500  dark:border-gray-600 px-6 py-3 rounded-lg flex items-center gap-2 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 transition"
            >
              <ClipboardCheck size={18} /> Check ATS Score
            </button>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex justify-center items-center lg:mt-0">
          <div className="relative flex justify-center ">
            {/* Floating chips */}
            <div className="absolute top-10 right-4  flex justify-end px-3 py-1 text-xs border border-[#d6cdc2] dark:border-gray-600 rounded-full bg-[#f8f3ea] dark:bg-gray-800 text-black dark:text-gray-200 shadow">
              ✦ AI-Powered
            </div>

            <div className="absolute bottom-10 px-3 py-1 text-xs border border-[#d6cdc2] dark:border-gray-600 rounded-full bg-[#f8f3ea] dark:bg-gray-800 text-black dark:text-gray-200 shadow">
              + Export PDF
            </div>

            {/* Cards */}
            <div className="relative w-72 h-[420px]">
              {[0, 1, 2].map((i) => {
                const isHovered = hoveredCard === i;

                const driftY = Math.sin(tick + i) * 8;
                const driftX = Math.cos(tick + i) * 6;

                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`absolute inset-0 rounded-xl p-4 cursor-pointer
            transition-all duration-500 ease-out
            ${isHovered ? "shadow-2xl" : "shadow-lg"}
            
            bg-[#f8f3ea] dark:bg-gray-800
            border border-[#d6cdc2] dark:border-gray-600
            text-black dark:text-gray-200
            `}
              style={{
  transform: `
    translate3d(${driftX}px, ${driftY + i * 10 + (isHovered ? -8 : 0)}px, 0)
    rotate(${i === 0 ? -6 : i === 1 ? -2 : 2}deg)
    scale(${isHovered ? 1.03 : 1})
  `,
  zIndex: isHovered ? 50 : 10 + i,
}}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6b645c] dark:text-gray-400">
                        BOTANICAL PRO
                      </span>
                      <span>📄</span>
                    </div>

                    <div className="space-y-2 my-3">
                      <div className="h-3 bg-[#e8e1d8] dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-2 bg-[#e8e1d8] dark:bg-gray-700 rounded w-1/2" />
                    </div>

                    <p className="text-sm font-medium">Software Engineer</p>
                    <p className="text-xs text-[#6b645c] dark:text-gray-400 mb-3">
                      Veritas Labs · 2022-Present
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="h-2 bg-[#e8e1d8] dark:bg-gray-700 rounded" />
                      <div className="h-2 bg-[#e8e1d8] dark:bg-gray-700 rounded w-5/6" />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {["React", "TypeScript", "Node.js"].map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-1 rounded-full 
                  bg-[#c07a3a]/10 text-[#c07a3a]
                  dark:bg-purple-500/20 dark:text-purple-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full 
              bg-[#f5efe6] dark:bg-gray-700 
              border border-[#d6cdc2] dark:border-gray-600 
              shadow-sm flex items-center gap-2"
                    >
                      Live preview
                      <span className="w-2 h-2 rounded-full bg-[#c07a3a] animate-pulse" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="absolute bottom-0 text-xs px-4 py-1 
      border border-[#d6cdc2] dark:border-gray-600 
      rounded-full bg-[#f8f3ea] dark:bg-gray-800 
      text-black dark:text-gray-200 shadow"
            >
              LIVE PREVIEW · AI GENERATED
            </div>
          </div>
        </div>
        
      </div>

      {/* Features Section */}
      <section className="bg-[#f5efe6] dark:bg-gray-800 w-full py-16 px-6">
        <h3 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          Everything You Need to Land Your Dream Job
        </h3>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300 mt-2">
          Two powerful modules to create and optimize your resume
        </p>

        <div className="mt-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resume Builder Card */}
          <div className="shadow-md rounded-2xl p-6 bg-[#faf7f2] dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-purple-500" size={24} />
              <h4 className="font-semibold text-2xl text-gray-800 dark:text-gray-100">
                Resume Builder Module
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-3">
              Create professional resumes from scratch
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 text-sm space-y-1">
              <li>Interactive form with all necessary fields</li>
              <li>Pre-designed professional templates</li>
              <li>Download resumes in PDF format</li>
            </ul>
          </div>

          {/* Resume Scorer Card */}
          <div className="shadow-md rounded-2xl p-6 bg-[#faf7f2] dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardCheck className="text-purple-500" size={24} />
              <h4 className="font-semibold text-2xl text-gray-800 dark:text-gray-100">
                Resume Scorer Module
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-3">
              Analyze and improve your existing resume
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 text-sm space-y-1">
              <li>Upload your existing resume</li>
              <li>Get ATS compatibility score instantly</li>
              <li>Suggestions to optimize your resume</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="w-full py-16 px-6 bg-[#f5efe6] dark:bg-gray-900">
        <h3 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          Why Choose ResumeAI ?
        </h3>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300 mt-2">
          Build professional resumes in minutes with advanced AI features
        </p>

        <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
          {/* Card 1 */}
          <div className="flex flex-col items-center">
            <div className="bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 p-4 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-xl text-gray-800 dark:text-gray-100">
              Fast & Easy
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">
              Create professional resumes in <br /> minutes with our intuitive
              interface
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center">
            <div className="bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 p-4 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zM12 14c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-xl text-gray-800 dark:text-gray-100">
              ATS Optimized
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">
              Get detailed scoring and recommendations to pass ATS systems
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center">
            <div className="bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 p-4 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12h16M4 8h16M4 4h16"
                />
              </svg>
            </div>
            <h4 className="font-semibold text-xl text-gray-800 dark:text-gray-100">
              Multiple Formats
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">
              Download your resume as PDF <br /> or Word document instantly
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}