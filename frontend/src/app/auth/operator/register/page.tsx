"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase, Mail, Phone, Lock, FileText, MapPin, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function OperatorRegister() {
  const router = useRouter();

  // Fields
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [businessReg, setBusinessReg] = useState("");
  const [tourismLicense, setTourismLicense] = useState("");
  const [address, setAddress] = useState("");
  const [taxInfo, setTaxInfo] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const pendingRequest = {
      id: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      name: ownerName,
      companyName,
      type: "Tour Operator Registration",
      email,
      phone,
      businessReg,
      tourismLicense,
      address,
      taxInfo,
      status: "pending",
      timestamp: new Date().toLocaleDateString()
    };

    // Store in localStorage operator queue
    const existingRaw = localStorage.getItem("pending_operator_applications");
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push(pendingRequest);
    localStorage.setItem("pending_operator_applications", JSON.stringify(existing));

    // Current user context
    localStorage.setItem("user_role", "operator");
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_status", "PENDING");
    localStorage.setItem("user_name", ownerName);

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
            <span className="text-[9px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-extrabold uppercase tracking-wider">Tourism Operations Partner</span>
            <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-3">Register as Tour Operator</h1>
            <p className="text-slate-500 text-xs mt-1.5 font-medium">Verify your tourism agency license to start listing custom guided packages.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Company Name</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karakoram Adventures"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Owner Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="Noman Ahmed"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="email"
                    required
                    placeholder="operator@ridesphere.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Phone Number</label>
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
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Password</label>
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
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Business Registration Number</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="REG-8877221"
                    value={businessReg}
                    onChange={(e) => setBusinessReg(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Government Tourism License Number</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="LIC-TOUR-5566"
                    value={tourismLicense}
                    onChange={(e) => setTourismLicense(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="Karimabad, Hunza"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Tax Information (NTN / GST)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. NTN-998811"
                    value={taxInfo}
                    onChange={(e) => setTaxInfo(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="border border-dashed border-slate-200 p-6 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <UploadCloud className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-xs font-bold text-slate-800">Upload Corporate Documentation</span>
              <p className="text-[10px] text-slate-450 mt-1 font-semibold">Please attach corporate registration certificates and valid tourism license documents.</p>
              <input type="file" multiple className="hidden" id="operator-uploads" />
              <label htmlFor="operator-uploads" className="mt-4 px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-650 rounded-lg cursor-pointer transition-colors shadow-sm">
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
              {isSubmitting ? "Registering business..." : "Register Agency"}
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
