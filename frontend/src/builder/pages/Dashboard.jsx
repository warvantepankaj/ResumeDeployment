import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Footer from "./Footer";

import { FileText, Trash2, Pencil } from "lucide-react";

import Loader from "@/builder/components/loaders/Loader";
import ResumeNameModal from "../modal/ResumeNameModal";
import DeleteResumeModal from "../modal/DeleteResumeModal";

export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  // const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  // ✅ Fetch resumes
  useEffect(() => {
    setOpenModal(false);
    if (!isSignedIn) return;

    const fetchResumes = async () => {
      setLoading(true);
      setTimeout(async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BUILDER_BASE_URL}/builder/resume/${user.id}`,
          );
          setResumes(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, 2000);
    };

    fetchResumes();
  }, [isSignedIn, user]);

  // ✅ Delete Resume
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BUILDER_BASE_URL}/builder/resume/${id}`);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Edit Resume
  const handleEdit = (id) => {
    navigate(`/resume-builder/${id}`);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f9f4ee] dark:bg-gray-900 overflow-hidden overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <div className="mt-32 px-6 md:px-16 flex justify-between items-center shrink-0">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Resumes
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2"
        >
          <FileText size={18} /> New Resume
        </button>
      </div>

      {/* Modal */}
      <ResumeNameModal isOpen={openModal} onClose={() => setOpenModal(false)} />

      {/* ✅ Scrollable Resume List */}
      <div className="flex-1 my-10 px-6 md:px-16 ">
        {!loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 justify-items-center p-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex flex-col bg-[#fcf8f3] dark:bg-gray-800 
             w-full max-w-[220px] h-[260px] 
             shadow-lg border border-gray-300 dark:border-gray-700
             hover:shadow-2xl transition p-4 rounded-xl"
              >
                <div className="flex-1">
                  <h2 className="text-[14px] font-bold text-gray-900 dark:text-white truncate">
                    {resume.title}
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Last Updated:{" "}
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>

                <div className="flex text-xs justify-between text-md mt-4 border-t border-gray-200 dark:border-gray-700 pt-2">
                  <button
                    onClick={() => handleEdit(resume.id)}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Pencil size={12} /> Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedResume(resume);
                      setOpenDelete(true);
                    }}
                    className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                  {selectedResume && (
                    <DeleteResumeModal
                      isOpen={openDelete}
                      onClose={() => setOpenDelete(false)}
                      id={selectedResume?.id}
                      resumeTitle={selectedResume?.title}
                      onDelete={(id) => {
                        // remove from UI list
                        setResumes((prev) => prev.filter((r) => r.id !== id));
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
