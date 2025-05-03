"use client";

import Image from "next/image";

export default function Question() {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center">
      <Image 
        src="/imggg.png" 
        layout="fill"
        objectFit="cover"
        alt="Quiz Background"
        className="absolute inset-0 -z-10"
      />

      {/* Quiz Container */}
      <div className="text-center">
        <h1 className="text-white text-3xl sm:text-4xl font-extrabold glow">Questions</h1>
        <p className="text-white sm:text-lg mt-2 px-2 font-bold">
          1. Get Questions for Yourself or Compete by Adding Your Friends!
        </p>
      </div>

      {/* Answer Buttons */}
      <div className="mt-4 px-6 space-y-4 w-full max-w-lg">
        {["A. hkjhkkhjh", "B. hkjhkkhjh", "C. hkjhkkhjh", ].map((option, index) => (
          <button 
            key={index} 
            className="block opacity-50 w-full py-4 text-white text-lg font-semibold rounded-xl bg-blue-500  backdrop-blur-md shadow-md transition-all hover:scale-105"
          >
            {option}
          </button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-8 right-8 text-white text-xl sm:text-2xl font-bold cursor-pointer glow-text">Exit quiz</div>
      <div className="absolute bottom-8 right-8 text-white text-xl sm:text-2xl font-bold cursor-pointer glow-text">
  Next...
</div>




      </div>
  );
}
