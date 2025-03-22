import Image from "next/image";
import Link from "next/link";

export default function Register() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <Image
        src="/img2.png"
        layout="fill"
        objectFit="cover"
        alt="Background Image"
      />

      <div className="absolute p-8 rounded-lg shadow-2xl w-80 sm:w-98 text-center">
      <p className="p-2 text-gray-700 font-semibold" >
          Do you have an account? <Link href="/login" className="text-blue-700 font-bold text-md hover:underline">Login</Link>
        </p>
        <form className="flex flex-col text-white space-y-4">
        <input
        type="text"
        placeholder="Name"
        className="bg-black opacity-60 text-white text-lg rounded-full p-2 sm:p-4"
      />
        <input
          type="email"
          placeholder="Email"
          className="bg-black opacity-60 text-white text-lg rounded-full p-2 sm:p-4"
          />
        <input
          type="password"
          placeholder="Password"
          className="bg-black opacity-60 text-white text-lg rounded-full p-2 sm:p-4"
          />
        <button className="bg-pink-500 text-white p-2 sm:p-4 rounded-full text-lg font-semibold shadow-lg hover:bg-pink-600 hover:cursor-pointer">
          SIGNUP
        </button>
      </form>
        
      </div>
    </div>
  );
}
