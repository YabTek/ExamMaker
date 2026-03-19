"use client"
import { Frijole } from "next/font/google";
import { useRouter } from "next/navigation";

const frijole = Frijole({ weight: "400", subsets: ["latin"] });

export default function Participate() {
  const router = useRouter();

  const handleSelect = (type: string) => {
    localStorage.setItem("participationType", type);
    router.push("/chooseLanguage");
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-teal-600/20 via-cyan-400/40 to-teal-700/40"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-teal-700 via-transparent to-teal-700 animate-pulse"></div>
      
      <div className="fixed top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
      <div className="fixed top-1/2 left-1/3 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl"></div>

      <div className="relative w-full min-h-screen flex items-center justify-center p-8">
        <div className="flex flex-col text-center">
          <h1 className={`${frijole.className} text-2xl sm:text-4xl lg:text-5xl font-bold text-blue-700 mb-6 lg:mb-12 drop-shadow-lg`}>
            WELCOME👋<br/> HOW DO YOU WANT TO<br /> PARTICIPATE IN THIS QUIZ?
          </h1>

          <div className="flex gap-6 justify-center">
            <button
              onClick={() => handleSelect("solo")}
              className={`${frijole.className} bg-blue-700 text-cyan-300 text-lg sm:text-xl lg:text-2xl font-bold rounded-2xl shadow-2xl px-12 py-3 lg:py-6 lg:px-20 hover:bg-blue-600 hover:scale-105 transition-all duration-300`}>
              ALONE
            </button>

            <button
              onClick={() => handleSelect("group")}
              className={`${frijole.className} bg-blue-700 text-cyan-300 text-lg sm:text-xl lg:text-2xl font-bold rounded-2xl shadow-2xl px-12 py-3 lg:py-6 lg:px-20 hover:bg-blue-600 hover:scale-105 transition-all duration-300`}>
              GROUP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
