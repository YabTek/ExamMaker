"use client"; 
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authApi, LoginRequest } from "@/services/authApi"; 
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: ""
  })
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      router.push("/chooseParticipation"); 
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

        <form onSubmit={handleLogin} className="flex flex-col text-gray-800 space-y-3">
          <input type="email" name="email" placeholder="Email" value={form.email}
            onChange={handleChange}
            className="bg-black opacity-60 text-white text-lg rounded-full p-2 sm:p-4" required/>

          <input type="password" name="password" placeholder="Password" value={form.password}
            onChange={handleChange}
            className="bg-black opacity-60 text-white text-lg rounded-full p-2 sm:p-4" required/>
            
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
