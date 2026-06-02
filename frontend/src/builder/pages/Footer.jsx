import { FileText } from 'react-feather'

const Footer = () => {
  return (
    <>
      <footer className="bg-[#f5efe6] border-t-2 shadow-sm dark:bg-gray-800 py-6 ">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-1 animate-slideDown">

          <span className="flex items-center text-xl gap-2 text-purple-700 dark:text-white font-semibold">
            <FileText size={24} />
            ResumeAI
          </span>

          <p className="text-gray-600 dark:text-gray-300 mt-1 text-md">
            Build professional resumes and get hired faster
          </p>

        </div>
      </footer>
    </>
  )
}

export default Footer
