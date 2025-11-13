"use client";
import Image from "next/image";
import { Mansalva } from "next/font/google";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mansalva = Mansalva({ weight: "400", subsets: ["latin"] });

export default function Generate() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { quizId } = useParams() as { quizId: string };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev < 100 ? prev + 10 : 100;
        if (next === 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push(`/questions/${quizId}`);
          }, 500);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [router, quizId]);

  return (
    <div className="relative w-full h-screen flex">
      <Image
        src="/img4.png"
        fill
        className="object-cover opacity-60"
        alt="Background Image"
      />

      <div className="absolute flex flex-col text-center px-24">
        <h1
          className={`${mansalva.className} text-3xl sm:text-5xl lg:text-6xl text-[#C50C91] pt-32 mb-3`}
        >
          Generating questions...
        </h1>
        <div className="bg-gray-300 relative p-2 overflow-hidden rounded-full w-128 ml-4">
          <div
            className="absolute left-0 top-0 h-full bg-[#BC3B98] rounded-full duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
