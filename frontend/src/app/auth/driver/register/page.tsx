"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, FileText, Award, ShieldAlert, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function DriverRegister() {
  const router = useRouter();

  // Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cnic, setCnic] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("city_ride");
  const [experience, setExperience] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const pendingRequest = {
      id: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      name: fullName,
      type: "Driver Registration",
      email,
      phone,
      cnic,
      licenseNumber,
      vehicleType,
      experience,
      status: "pending",
      timestamp: new Date().toLocaleDateString()
    };

    // Store in localStorage driver queue
    const existingRaw = localStorage.getItem("pending_driver_applications");
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push(pendingRequest);
    localStorage.setItem("pending_driver_applications", JSON.stringify(existing));

    // Current user context
    localStorage.setItem("user_role", "driver");
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
            <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full font-extrabold uppercase tracking-wider">Chauffeur Drive Partner</span>
            <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-3">Register as Chauffeur Driver</h1>
            <p className="text-slate-500 text-xs mt-1.5 font-medium">Verify your commercial license to access premium client dispatch jobs.</p>
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
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="email"
                    required
                    placeholder="driver@ridesphere.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">CNIC Number</label>
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
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Driving License Number</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    placeholder="DL-PK-992211"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Vehicle Category Expertise</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="city_ride">City Ride (Standard sedan/hatchback)</option>
                  <option value="luxury">Luxury Car (Luxury sedans/sports cars)</option>
                  <option value="bus_coaster">Tour Bus & Coaster</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Years of Chauffeur Experience</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="border border-dashed border-slate-200 p-6 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <UploadCloud className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-xs font-bold text-slate-800">Upload Verification Credentials</span>
              <p className="text-[10px] text-slate-450 mt-1 font-semibold">Please attach: CNIC, License card copy, and Police Verification Certificate (PDF/JPG).</p>
              <input type="file" multiple className="hidden" id="driver-uploads" />
              <label htmlFor="driver-uploads" className="mt-4 px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-650 rounded-lg cursor-pointer transition-colors shadow-sm">
                Choose Documents
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
              {isSubmitting ? "Submitting details..." : "Submit Driver Application"}
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
