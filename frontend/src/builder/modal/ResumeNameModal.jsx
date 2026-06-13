import axios from "axios";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ResumeNameModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_BUILDER_BASE_URL}/builder/resume`, {
        title: name,
        userId: user?.id,
      });
      
      setName("");
      onClose();
      
      if (onCreate) onCreate(name);
      
      const resumeId = res.data.id;
      navigate(`/resume-builder/${resumeId}`);
    } catch (error) {
      console.error("Error creating resume:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm py-4 px-10">
      {/* The 'relative' class here is the "anchor". 
        It ensures the absolute 'X' button stays inside this box.
      */}
      <div className="relative bg-[#faf7f2] dark:bg-gray-900 w-full max-w-[35%] rounded-2xl shadow-2xl p-8">
        
        {/* Close Button (X) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all p-1"
          aria-label="Close"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          New Resume
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Give your new project a name to get started.
        </p>

        {/* Input Field */}
        <div className="space-y-2">
          <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Resume Title
          </label>
          <input
            type="text"
            placeholder="e.g. Full Stack Developer 2024"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl outline-none bg-[#f9f5f0] border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-all"
            autoFocus
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row-reverse gap-3 mt-8">
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            Create New
          </button>

          <button
            onClick={() =>{ navigate("/dashboard")}}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-[#fbf3e7] dark:hover:bg-gray-800 font-medium transition-all"
          >
            Edit Existing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeNameModal;