import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';

export default function FileDropZone({ onFileDrop, file, onClear, label, accept }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) onFileDrop(acceptedFiles[0]);
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    multiple: false,
  });

 if (file) {
  return (
    <div className="p-5 flex items-center justify-between rounded-xl 
      bg-[#fdfbf6] dark:bg-gray-800 
      border border-[#d6cdc2] dark:border-gray-600 shadow-sm">

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg 
          bg-purple-100 dark:bg-purple-900/40 
          flex items-center justify-center">
          <FileText size={20} className="text-purple-600 dark:text-purple-300" />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>

      <button
        onClick={onClear}
        className="text-gray-400 hover:text-red-500 transition"
      >
        <X size={20} />
      </button>
    </div>
  );
}
  return (
  <div
    {...getRootProps()}
    className={`p-10 text-center cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300
      ${
        isDragActive
          ? "border-purple-500 bg-purple-100/40 dark:bg-purple-900/20"
          : "border-[#d6cdc2] dark:border-gray-600 bg-[#f6f5f3] dark:bg-gray-800 hover:border-purple-400"
      }`}
  >
    <input {...getInputProps()} />

    <div className="flex flex-col items-center gap-3">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center
        ${isDragActive
          ? "bg-purple-200 dark:bg-purple-800"
          : "bg-[#e8e1d8] dark:bg-gray-700"
        }`}
      >
        <Upload
          size={28}
          className={
            isDragActive
              ? "text-purple-600 dark:text-purple-300"
              : "text-gray-500 dark:text-gray-400"
          }
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label || "Drop your resume here"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          PDF, DOCX, or TXT • Max 10MB
        </p>
      </div>
    </div>
  </div>
);
}
