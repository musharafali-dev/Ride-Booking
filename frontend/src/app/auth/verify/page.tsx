"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem("user_phone") || "+92 300 1234567";
    setPhone(savedPhone);
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      alert("Please enter a 6-digit verification code");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setVerified(true);
      
      // Complete verified user state
      const userRole = localStorage.getItem("user_role") || "customer";
      setTimeout(() => {
        router.push(`/dashboard/${userRole}`);
      }, 1000);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-xl relative overflow-hidden text-center">
          
          <div className="mb-6 flex justify-center">
            <div className={`p-3 rounded-2xl ${verified ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
              {verified ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
            </div>
          </div>

          <h1 className="font-display font-bold text-2xl text-slate-900">
            {verified ? "Verification Complete" : "Verify Phone Number"}
          </h1>
          <p className="text-slate-500 text-xs mt-2 mb-6">
            {verified 
              ? "Your account has been verified. Redirecting you to workspace..."
              : `We have dispatched a 6-digit verification code to ${phone}`
            }
          </p>

          {!verified && (
            <form onSubmit={handleVerify} className="space-y-5 text-left">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                  Verification Code (Simulate: 123456)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-3 text-center font-bold tracking-widest text-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <span>{submitting ? "Verifying..." : "Verify Code"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-center text-xs text-slate-400 font-semibold pt-2">
                Didn&apos;t receive code? <button type="button" onClick={() => alert("OTP code re-sent!")} className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer">Resend OTP</button>
              </p>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
