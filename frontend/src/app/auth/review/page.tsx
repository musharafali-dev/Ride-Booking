"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShieldAlert, FileText, ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";

export default function ReviewPage() {
  const router = useRouter();
  const [name, setName] = useState("Partner");
  const [role, setRole] = useState("Owner");
  const [status, setStatus] = useState("PENDING");

  useEffect(() => {
    setName(localStorage.getItem("user_name") || "Partner");
    setRole(localStorage.getItem("user_role") || "Owner");
    setStatus(localStorage.getItem("user_status") || "PENDING");
  }, []);

  const handleLogOut = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-secondary">
      <Navbar />

      <main className="grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6">
          
          {status === "REJECTED" ? (
            <>
              <div className="w-16 h-16 bg-red-50 text-red-650 border border-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h1 className="font-display font-extrabold text-2xl text-slate-900">Application Rejected</h1>
                <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                  Hello {name}, your partner application as a <strong className="capitalize">{role.replace("_", " ")}</strong> was rejected by compliance. Please contact system support.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-amber-50 text-amber-600 border border-amber-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Clock className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h1 className="font-display font-extrabold text-2xl text-slate-900">Application Under Review</h1>
                <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                  Hello {name}, your onboarding application as a <strong className="capitalize">{role.replace("_", " ")}</strong> has been submitted successfully.
                </p>
                <p className="text-slate-400 text-[10px] max-w-xs mx-auto font-semibold">
                  Our compliance team will inspect your uploaded license & verification certificates within 24-48 hours.
                </p>
              </div>
            </>
          )}

          <div className="flex flex-col gap-2.5 pt-4">
            <button
              onClick={() => {
                // Refresh status simulation check
                const currentStatus = localStorage.getItem("user_status") || "PENDING";
                setStatus(currentStatus);
                if (currentStatus === "ACTIVE") {
                  router.push(`/dashboard/${role}`);
                }
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Check Application Status
            </button>

            <button
              onClick={handleLogOut}
              className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Login
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
