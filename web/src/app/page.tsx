import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center pt-38 md:pl-48">
      <Image
        src="/img1.png"
        layout="fill"
        objectFit="cover"
        alt="Background Image"
      />
      
      <div className="absolute flex flex-col text-center items-center md:pl-48">
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-blue-800 ">
      Improve your mind with<br /><span className="text-pink-500">AI</span> generated exams
        </h1>
        <p className="text-md sm:text-2xl lg:text-lg text-gray-700 mt-2 ">
          Get Questions for Yourself or <br/> Compete by Adding Your Friends!
        </p>
        
        <div className="flex space-x-4 mt-4">
          <button className="bg-pink-500 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-md hover:bg-pink-600 hover:cursor-pointer">
            <Link href="register">            
            SIGNUP
            </Link>
          </button>
          <button className="bg-purple-400 text-white px-8 py-2 rounded-full text-lg font-semibold shadow-md hover:bg-purple-500 hover:cursor-pointer">
            <Link href="login">            
              LOGIN
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
