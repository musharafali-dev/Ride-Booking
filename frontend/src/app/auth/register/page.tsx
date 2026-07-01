"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, Lock, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    localStorage.setItem("user_role", role);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_phone", phone);

    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to OTP verification simulation page
      router.push("/auth/verify");
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-2xl text-slate-900">Create RideSphere Account</h1>
            <p className="text-slate-500 text-xs mt-1">Get verified to unlock city dispatches, fleet listings, and tours</p>
          </div>

          {/* Role Choice Tab Grid */}
          <div className="grid grid-cols-4 gap-2 mb-6 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {[
              { id: "customer", label: "Customer" },
              { id: "owner", label: "Owner" },
              { id: "driver", label: "Driver" },
              { id: "operator", label: "Operator" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRole(tab.id)}
                className={`py-2 text-[10px] sm:text-xs font-bold rounded-xl cursor-pointer transition-all ${
                  role === tab.id
                    ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                    : "text-slate-550 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 h-4.5 w-4.5" />
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-blue-600 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 h-4.5 w-4.5" />
                  <input
                    type="email"
                    required
                    placeholder="jane@ridesphere.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-blue-600 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-455 h-4.5 w-4.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-blue-600 focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 h-4.5 w-4.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-blue-600 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-500 leading-relaxed py-1.5 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                By signing up, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Shield</strong>. Verification verification OTP code will be sent to your number.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <span>{isSubmitting ? "Generating Account..." : "Create Free Account"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
            Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
