import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

const DeleteResumeModal = ({ isOpen, onClose, id, resumeTitle, onDelete }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isMatch = input.trim() === resumeTitle;

  const handleDelete = async () => {
    if (!isMatch) return;

    try {
      setLoading(true);

      await axios.delete(`http://127.0.0.1:8000/builder/resume/${id}`);

      setInput("");
      onClose();

      if (onDelete) onDelete(id);
      Swal.fire({
        title: "Resume Deleted Successfully",
        icon: "success",
      });
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm py-4 px-10">
      <div className="relative bg-[#faf7f2] dark:bg-gray-900 w-full max-w-[35%] rounded-2xl shadow-2xl p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all p-1"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-red-600 mb-2">Delete Resume</h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          This action{" "}
          <span className="font-semibold text-red-500">cannot be undone</span>.
          To confirm, type the resume name below:
        </p>

        {/* Resume Name Highlight */}
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 font-medium">
          {resumeTitle}
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Type resume name to confirm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl outline-none bg-[#f9f5f0] border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-all"
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row-reverse gap-3 mt-8">
          <button
            onClick={handleDelete}
            disabled={!isMatch || loading}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-[#fbf3e7] dark:hover:bg-gray-800 font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteResumeModal;
