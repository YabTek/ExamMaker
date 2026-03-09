"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("participationType");
    router.push("/login");
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setShowMenu(false);
  };

  return (
    <nav className="fixed top-0 right-0 z-30 p-4">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="bg-blue-700/80 hover:bg-blue-700 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all"
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {showMenu ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          )}
        </svg>
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 -z-10"
            onClick={() => setShowMenu(false)}
          />
          
          <div className="absolute top-16 right-0 bg-blue-700/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden min-w-[200px] border border-cyan-400/30">
            <button
              onClick={() => navigateTo("/chooseParticipation")}
              className={`w-full text-left px-6 py-4 text-white hover:bg-blue-600/80 transition-colors flex items-center gap-3 ${
                pathname === "/chooseParticipation" ? "bg-blue-600/60" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>

            <button
              onClick={() => navigateTo("/analytics")}
              className={`w-full text-left px-6 py-4 text-white hover:bg-blue-600/80 transition-colors flex items-center gap-3 border-t border-cyan-400/20 ${
                pathname === "/analytics" ? "bg-blue-600/60" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-6 py-4 text-red-200 hover:bg-red-600/80 transition-colors flex items-center gap-3 border-t border-cyan-400/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
}