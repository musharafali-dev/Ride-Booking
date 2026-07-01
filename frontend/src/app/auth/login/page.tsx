"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // Simple simulated authentication
    if (email === "admin@ridesphere.com" && password === "admin123") {
      localStorage.setItem("user_role", "admin");
      router.push("/dashboard");
    } else if (email === "owner@ridesphere.com" && password === "owner123") {
      localStorage.setItem("user_role", "owner");
      router.push("/dashboard");
    } else {
      localStorage.setItem("user_role", "customer");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-[#0c0f17] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl text-white">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-2">Login to manage your rides, rentals & tours</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4.5 w-4.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@ridesphere.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg py-2.5 pl-10 pr-4 focus:border-indigo-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4.5 w-4.5" />
                <input
                  type="password"
                  required
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg py-2.5 pl-10 pr-4 focus:border-indigo-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-rose-400 text-xs bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{isSubmitting ? "Logging in..." : "Login"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don&apos;t have an account? <Link href="/auth/register" className="text-indigo-400 hover:underline">Register</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
