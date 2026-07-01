"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ShieldAlert, LogIn, UserPlus } from "lucide-react";

export default function AuthGuardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleShow = () => setIsOpen(true);
    window.addEventListener("show-auth-guard", handleShow);
    return () => window.removeEventListener("show-auth-guard", handleShow);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-2xl space-y-6 text-center">
        
        <div className="flex justify-between items-center">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mx-auto">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-bold text-xl text-slate-900">Sign in to Continue</h3>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
            Create an account or sign in to book vehicles, rent touring bikes, reserve tours, save favorites, and access your dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/auth/login");
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogIn className="h-4 w-4" /> Sign In
          </button>
          
          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/auth/register");
            }}
            className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" /> Create Account
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
