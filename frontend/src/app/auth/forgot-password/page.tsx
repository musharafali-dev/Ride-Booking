"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-xl relative overflow-hidden text-center">
          
          <div className="mb-6 flex justify-center">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Mail className="h-6 w-6" />
            </div>
          </div>

          <h1 className="font-display font-bold text-2xl text-slate-900">Reset Password</h1>
          <p className="text-slate-500 text-xs mt-2 mb-6">
            Enter your email address and we will send you instructions to reset your password.
          </p>

          {sent ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-2xl">
                A password recovery link has been dispatched to <strong>{email}</strong>. Please inspect your inbox.
              </div>
              <Link
                href="/auth/login"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 h-4.5 w-4.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-blue-600 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? "Sending..." : "Send Reset Link"}</span>
              </button>

              <div className="text-center pt-2">
                <Link href="/auth/login" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
