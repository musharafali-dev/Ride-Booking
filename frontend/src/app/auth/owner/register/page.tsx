"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase, Mail, Phone, Lock, FileText, MapPin, UploadCloud, Check } from "lucide-react";
import Link from "next/link";

export default function OwnerRegister() {
  const router = useRouter();
  
  // Fields
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cnic, setCnic] = useState("");
  const [address, setAddress] = useState("");
  const [businessReg, setBusinessReg] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // Save registration details to simulation queue
    const pendingRequest = {
      id: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      name: fullName,
      businessName,
      type: "Vehicle Owner Registration",
      email,
      phone,
      cnic,
      address,
      businessReg,
      taxNumber,
      status: "pending",
      timestamp: new Date().toLocaleDateString()
    };

    // Store pending owner in localStorage for admin panel approval
    const existingRaw = localStorage.getItem("pending_owner_applications");
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push(pendingRequest);
    localStorage.setItem("pending_owner_applications", JSON.stringify(existing));

    // Also set current user to pending
    localStorage.setItem("user_role", "owner");
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_status", "PENDING");
    localStorage.setItem("user_name", fullName);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/auth/review");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-secondary">
      <Navbar />

      <main className="grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-xl bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-xl">
          
          <div className="text-center mb-8">
            <span className="text-[9px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-extrabold uppercase tracking-wider">Fleet Partner Portal</span>
            <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-3">Register as Vehicle Owner</h1>
            <p className="text-slate-500 text-xs mt-1.5 font-medium">List your cars, bikes, or coasters to start earning fleet revenue.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Business Name (Optional)</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="e.g. Apex Rentals"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="email"
                    required
                    placeholder="owner@ridesphere.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">CNIC / Passport Number</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="35202-XXXXXXX-X"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Business Registration (If applicable)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="REG-998822"
                    value={businessReg}
                    onChange={(e) => setBusinessReg(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="DHA Phase 6, Lahore"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tax Number (NTN)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="NTN-776655"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="border border-dashed border-slate-200 p-6 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <UploadCloud className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-xs font-bold text-slate-800">Upload Identity & Registration Docs</span>
              <p className="text-[10px] text-slate-450 mt-1 font-semibold">Please attach PDF or Image copies of your CNIC/Passport and Registration License.</p>
              <input type="file" multiple className="hidden" id="doc-upload" />
              <label htmlFor="doc-upload" className="mt-4 px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-650 rounded-lg cursor-pointer transition-colors shadow-sm">
                Choose Files
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-650 text-xs font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
            >
              {isSubmitting ? "Submitting Application..." : "Submit Registration for Review"}
            </button>

            <div className="text-center pt-2">
              <Link href="/auth/login" className="text-xs font-bold text-slate-500 hover:text-slate-800 underline">
                Return to Login
              </Link>
            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
