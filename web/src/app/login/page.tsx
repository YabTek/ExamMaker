"use client"; 
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authApi, LoginRequest } from "@/services/authApi"; 
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: ""
  })
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect"); 
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(form);
      localStorage.setItem("token", res.data.token);
      router.push(redirect || "/chooseParticipation"); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <Image src="/img2.png" fill className="object-cover" alt="Background Image"/>
      <div className="absolute p-8 rounded-lg shadow-2xl w-80 sm:w-98 text-center">
        <p className="p-2 text-gray-700 font-semibold">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-700 font-bold text-md hover:underline">
            Signup
          </Link>
        </p>

        <form onSubmit={handleLogin} className="flex flex-col space-y-3">
          <input type="email" name="email" placeholder="Email" value={form.email}
            onChange={handleChange}
            className="bg-black opacity-60 text-white text-lg rounded-full p-2 sm:p-4" required/>

          <div className="relative">
            <input 
              type={seePassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              value={form.password}
              onChange={handleChange}
              className="w-full bg-black opacity-60 text-white text-lg rounded-full p-2 sm:p-4 pr-12" 
              required
            />
            <button
              type="button"
              onClick={() => setSeePassword(!seePassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
            >
              {seePassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
            
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="bg-pink-500 text-white p-2 sm:p-4 rounded-full text-lg font-semibold shadow-lg hover:bg-pink-600 hover:cursor-pointer disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}