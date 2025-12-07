"use client"
import Image from "next/image";
import { Frijole } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { quizApi } from "@/services/quizApi";

const frijole = Frijole({ weight: "400", subsets: ["latin"] });

export default function ChooseLanguage() {
    const router = useRouter();
    const [selected, setSelected]  = useState<string | null>(null);
    const [error, setError]  = useState<string | null>(null);

    const participationType = localStorage.getItem("participationType");

    const handleSoloClick = async () => {
      if (!participationType || !selected || (participationType !== "solo")) {
          return;
        }
        const res = await quizApi.createQuiz({mode: participationType, language: selected});
        router.push(`/generateQuestions/${res.data.quizId}`);
    }

    const handleClick = () => {
        if (selected){
            localStorage.setItem("language", selected);
        }
        else{
            setError("Please select a language")
        }
    };
    const getBtnClass = (lang: string) => 
        `${frijole.className} text-2xl font-bold rounded-2xl shadow-2xl p-4 sm:px-10 text-cyan-300 bg-blue-700 opacity-90 cursor-pointer 
     ${selected === lang ? "border-3 border-cyan-200" : "border-none"}`;

    

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <Image
        src="/img12.png"
        layout="fill"
        objectFit="cover"
        alt="Background Image"
      />

      <div className="absolute flex flex-col text-center pt-32">
        <h1
          className={`${frijole.className} text-2xl sm:text-4xl lg:text-5xl font-bold text-blue-700 mt-[-6rem] mb-8`}>
          PICK A LANGUAGE <br /> FOR YOUR QUIZ
        </h1>

        <div className="flex space-x-6 justify-center mb-6">
            <button onClick={() => setSelected("Python")} className={getBtnClass("Python")}>
              Python
            </button>
            <button onClick={() => setSelected("Java")} className={getBtnClass("Java")}>
              Java
            </button>
        </div>

        <div className="flex space-x-6 justify-center mb-10">
            <button onClick={() => setSelected("JavaScript")} className={getBtnClass("JavaScript")}>
              JavaScript
            </button>
            <button onClick={() => setSelected("TypeScript")} className={getBtnClass("TypeScript")}>
              TypeScript
            </button>
        </div>

        <div className="flex justify-center">
          {participationType === "solo" ? (
              <button onClick={handleSoloClick}
                className={`${frijole.className} bg-pink-500 text-white text-2xl font-bold rounded-2xl shadow-2xl px-12 py-4 hover:bg-pink-600 hover:cursor-pointer opacity-90`}>
                Start Quiz
              </button>
          ) : (
             <Link href="addPeople">
              <button onClick={handleClick}
                className={`${frijole.className} bg-pink-500 text-white text-2xl font-bold rounded-2xl shadow-2xl px-12 py-4 hover:bg-pink-600 hover:cursor-pointer opacity-90`}>
                Next
              </button>
          </Link>
          )} 
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}

      </div>
    </div>
  );
}
