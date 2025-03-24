import Image from "next/image";
import { Mansalva } from "next/font/google";

const mansalva = Mansalva({ weight: "400", subsets: ["latin"] });

export default function Generate() {
  return (
    <div className="relative w-full h-screen flex">
      <Image
        src="/img4.png"
        layout="fill"
        objectFit="cover"
        alt="Background Image"
        className="opacity-60"
      />

    <div className="absolute flex flex-col text-center px-24">
        <h1 className={`${mansalva.className} text-3xl sm:text-5xl lg:text-6xl  text-[#C50C91] pt-32 mb-3`}>
        Generating questions...
        </h1>
       <div className="bg-gray-300 relative p-2 overflow-hidden rounded-full">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-[#BC3B98] rounded-full animate-moving"></div>
        </div>
      </div>
    </div>
  );
}
