"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import QuizHistorySidebar from "@/components/QuizHistorySidebar";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const showSidebar = ["/chooseParticipation", "/history", "/analytics"].some(
    (path) => pathname.startsWith(path)
  );

  const showNavbar = !["/login", "/register", "/"].some((path) => pathname === path) && !pathname.startsWith("/questions") && !pathname.startsWith("/generateQuestions");

  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0 p-0">
        {showNavbar && <Navbar />}
        
        {showSidebar && (
          <>
            <QuizHistorySidebar 
              isOpen={sidebarOpen} 
              onToggle={() => setSidebarOpen(!sidebarOpen)} 
            />
            
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="group fixed top-4 left-4 z-20 lg:hidden bg-blue-600/30 hover:bg-blue-700/30 text-white p-3 rounded-lg shadow-lg hover:scale-110 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="absolute top-full mt-2 ml-4 left-1/2 -translate-x-1/2 bg-blue-900/60 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Show sidebar
                </span>
              </button>
            )}
          </>
        )}
        
        <main className={showSidebar ? "lg:ml-80 transition-all duration-300" : "transition-all duration-300"}>
          {children}
        </main>
      </body>
    </html>
  );
}