"use client"
import Image from "next/image";
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
    <div className="relative w-full h-screen flex items-center justify-center">
      <Image src="/img11.png" layout="fill" objectFit="cover" alt="Background" />

      <div className="absolute flex flex-col text-center">
        <h1 className={`${frijole.className} text-2xl sm:text-4xl lg:text-5xl font-bold text-blue-700 mt-[-6rem] mb-6`}>
          HOW DO YOU WANT TO<br /> PARTICIPATE IN THIS QUIZ?
        </h1>

        <div className="space-x-4 justify-center">
          <button
            onClick={() => handleSelect("solo")}
            className={`${frijole.className} bg-blue-700 text-cyan-300 text-2xl font-bold rounded-2xl shadow-2xl p-2 sm:py-4 sm:px-26 hover:bg-blue-600 hover:cursor-pointer`}>
            Alone
          </button>

          <button
            onClick={() => handleSelect("group")}
            className={`${frijole.className} bg-blue-700 text-cyan-300 text-2xl font-bold rounded-2xl shadow-2xl p-2 sm:py-4 sm:px-26 hover:bg-blue-600 hover:cursor-pointer`}>
            Group
          </button>
        </div>
      </div>
    </div>
  );
}
