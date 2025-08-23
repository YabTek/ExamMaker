"use client"
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import { authApi, RegisterRequest }  from "@/services/authApi";
import {useRouter} from "next/navigation";

export default function Register() {
  const [form, setForm] = useState<RegisterRequest>({
    email: "",
    password: "",
    username: ""
  });

  const [error, setError] = useState<string | null> (null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  }  

  const handleRegister = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try{
      const res = await authApi.register(form);
      router.push("/login");
    }
    catch(err: any){
      setError(err.response?.data?.message || "Registration failed");
    }
    finally{
      setLoading(false);
    }


  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <Image src="/img2.png" layout="fill" objectFit="cover" alt="Background Image"/>

      <div className="absolute p-8 rounded-lg shadow-2xl w-80 sm:w-98 text-center">
      <p className="p-2 text-gray-700 font-semibold" >
          Do you have an account? <Link href="/login" className="text-blue-700 font-bold text-md hover:underline">Login</Link>
        </p>
        <form onSubmit={handleRegister} className="flex flex-col text-white space-y-4">
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="username"
          className="bg-black opacity-60 text-white text-lg rounded-full p-2 sm:p-4"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="bg-black opacity-60 text-white text-lg rounded-full p-2 sm:p-4"
          />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="bg-black opacity-60 text-white text-lg rounded-full p-2 sm:p-4"
          />
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button className="bg-pink-500 text-white p-2 sm:p-4 rounded-full text-lg font-semibold shadow-lg hover:bg-pink-600 hover:cursor-pointer"
        disabled={loading}>
          {loading ? "Signing up..." : "SIGNUP"}
        </button>
      </form>
        
      </div>
    </div>
  );
}
