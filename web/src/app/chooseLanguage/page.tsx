import Image from "next/image";
import { Frijole } from "next/font/google";
import Link from "next/link";

const frijole = Frijole({ weight: "400", subsets: ["latin"] });

export default function ChooseLanguage() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <Image
        src="/img3.png"
        layout="fill"
        objectFit="cover"
        alt="Background Image"
      />

      <div className="absolute flex flex-col text-center pt-32">
        <h1
          className={`${frijole.className} text-2xl sm:text-4xl lg:text-5xl font-bold text-blue-700 mt-[-6rem] mb-10`}>
          PICK A LANGUAGE <br /> FOR YOUR QUIZ
        </h1>

        <div className="flex space-x-6 justify-center mb-6">
            <button
              className={`${frijole.className} bg-blue-700 text-cyan-300 text-2xl font-bold rounded-2xl shadow-2xl p-4 sm:px-10 hover:bg-blue-600`}>
              Python
            </button>
            <button
              className={`${frijole.className} bg-blue-700 text-cyan-300 text-2xl font-bold rounded-2xl shadow-2xl p-4 sm:px-10 hover:bg-blue-600`}>
              Java
            </button>
        </div>

        <div className="flex space-x-6 justify-center mb-10">
            <button
              className={`${frijole.className} bg-blue-700 text-cyan-300 text-2xl font-bold rounded-2xl shadow-2xl p-4 sm:px-10 hover:bg-blue-600`}>
              JavaScript
            </button>
            <button
              className={`${frijole.className} bg-blue-700 text-cyan-300 text-2xl font-bold rounded-2xl shadow-2xl p-4 sm:px-10 hover:bg-blue-600`}>
              TypeScript
            </button>
        </div>

        <div className="flex justify-center">
          <Link href="generateQuestions">
            <button
              className={`${frijole.className} bg-pink-500 text-white text-2xl font-bold rounded-2xl shadow-2xl px-12 py-4 hover:bg-pink-600 hover:cursor-pointer`}>
              Start Quiz
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
