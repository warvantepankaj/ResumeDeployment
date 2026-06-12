import { useUser, useClerk } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, FileText } from "lucide-react";

export default function CustomUserMenu() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  if (!user) return null;
  useEffect(()=>{
    const handleOutsiteClick = (e) =>{
      if(menuRef.current && !menuRef.current.contains(e.target)){
        setOpen(false)
      }

    }
     document.addEventListener("mousedown",handleOutsiteClick);
     return ()=>{
      document.removeEventListener("mousedown",handleOutsiteClick);
     }

  },[])

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar */}
      <img
        src={user.imageUrl}
        alt="user"
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full object-cover object-center bg-center cursor-pointer"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 px-2 w-72 bg-[#f5efe6] dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-700">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 border-b dark:border-gray-700">
            <img
              src={user.imageUrl}
              alt="user"
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-purple-500 transition"
            />
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">
                {user.fullName}
              </p>
              <p className="text-sm text-gray-500">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2" onClick={()=>setOpen(false)}>
            {/* Manage Account */}
            <button
              onClick={() => openUserProfile()}
              className="flex items-center gap-3 w-full px-4 py-2  dark:hover:bg-gray-800"
            >
              <Settings size={18} /> Manage account
            </button>

            {/* My Resume */}
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 w-full px-4 py-2  dark:hover:bg-gray-800"
            >
              <FileText size={18} /> My Resume
            </button>

            {/* Sign Out */}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 ml-1 w-full px-4 py-2  dark:hover:bg-gray-800 text-red-500"
            >
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
