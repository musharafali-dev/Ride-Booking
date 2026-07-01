"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Key, Server, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [ipAddress, setIpAddress] = useState("192.168.1.1");
  const [deviceSig, setDeviceSig] = useState("Unknown Device");

  useEffect(() => {
    // Simulate IP and Device tracking
    setIpAddress(`192.168.1.${Math.floor(10 + Math.random() * 90)}`);
    setDeviceSig(`Chrome v122 &bull; Windows 11 (Secure signature verified)`);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!twoFactorCode || twoFactorCode.length < 6) {
      setErrorMsg("Please enter a valid 6-digit MFA verification code.");
      return;
    }

    setIsSubmitting(true);

    // Save admin details
    localStorage.setItem("user_role", "admin");
    localStorage.setItem("user_email", email || "admin1@ridesphere.com");
    localStorage.setItem("user_status", "ACTIVE");
    localStorage.setItem("user_name", "Admin Manager");

    // Add security audit log
    const existingLogsRaw = localStorage.getItem("admin_security_logs") || "[]";
    const existingLogs = JSON.parse(existingLogsRaw);
    existingLogs.unshift({
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      action: `Admin console accessed from IP ${ipAddress}`,
      user: email || "admin1@ridesphere.com",
      status: "Success"
    });
    localStorage.setItem("admin_security_logs", JSON.stringify(existingLogs));

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard/admin");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-secondary">
      <Navbar />

      <main className="grow grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Security & Audit Metrics */}
        <div className="hidden lg:flex lg:col-span-5 bg-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" 
              alt="Cybersecurity grid background" 
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-linear-to-br from-slate-900/80 to-slate-950/98 mix-blend-multiply"></div>
          </div>

          <div className="relative z-10">
            <Link href="/" className="font-display font-black text-2xl tracking-tight text-white flex items-center gap-1">
              Ride<span className="text-blue-500">Sphere</span> <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">CONTROL</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-6 my-auto">
            <h2 className="font-display font-extrabold text-2xl leading-tight">
              Central Operations Gateway
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Operations Node</span>
                <p className="text-xs font-mono text-emerald-400 font-bold">NODE-PK-LAHORE-04</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Gateway IP Address</span>
                <p className="text-xs font-mono text-slate-200">{ipAddress} (Region: PK)</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Device Signature</span>
                <p className="text-xs font-mono text-slate-200" dangerouslySetInnerHTML={{ __html: deviceSig }}></p>
              </div>
            </div>
          </div>

          {/* Alert Warning footer */}
          <div className="relative z-10 flex gap-3 items-start bg-red-950/40 border border-red-900/50 p-4 rounded-2xl">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="block text-[11px] font-bold text-red-400">Restricted Console</span>
              <p className="text-[10px] text-red-300 font-semibold leading-relaxed">
                Unauthorized access attempts are monitored, logged, and reported to the system security officer automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Security Login Form */}
        <div className="lg:col-span-7 bg-white flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            
            <div>
              <span className="text-[9px] bg-red-50 text-red-650 px-3 py-1 rounded-full font-extrabold uppercase tracking-wider">Restricted Administration</span>
              <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-3">Admin Console Sign In</h1>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">Verify credentials and Multi-Factor code to load management operations.</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="email"
                    required
                    placeholder="admin@ridesphere.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-red-600 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-red-600 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Two-Factor Authenticator Code</label>
                  <span className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">Resend OTP</span>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-850 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-red-600 font-mono tracking-widest text-center text-md font-bold"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-650 text-[10px] font-semibold rounded-xl">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-950/50 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Server className="h-4 w-4" /> {isSubmitting ? "Verifying Token..." : "Authenticate Admin Session"}
              </button>

            </form>

            <div className="text-center pt-2 space-y-2">
              <p className="text-[10px] text-slate-400 font-semibold">
                Are you a Super Admin? <Link href="/super-admin/login" className="text-blue-600 font-bold hover:underline">Log in with Security Key</Link>
              </p>
              <div>
                <Link href="/auth/login" className="text-xs font-bold text-slate-500 hover:text-slate-800 underline">
                  Back to User Sign In
                </Link>
              </div>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
