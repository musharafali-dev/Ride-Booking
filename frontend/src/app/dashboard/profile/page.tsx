"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, CreditCard, Shield, Save, Check } from "lucide-react";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Jane Doe");
  const [email, setEmail] = useState("customer1@ridesphere.com");
  const [phone, setPhone] = useState("+92 300 1234567");
  const [address, setAddress] = useState("12 Main Boulevard, Gulberg III, Lahore");
  const [emergencyName, setEmergencyName] = useState("John Doe");
  const [emergencyPhone, setEmergencyPhone] = useState("+92 300 7654321");
  const [savedCards, setSavedCards] = useState([
    { brand: "Visa", last4: "4242", exp: "12/28" },
    { brand: "Mastercard", last4: "8899", exp: "05/27" }
  ]);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("user_name") || "Jane Doe";
    const savedEmail = localStorage.getItem("user_email") || "customer1@ridesphere.com";
    const savedPhone = localStorage.getItem("user_phone") || "+92 300 1234567";
    setFullName(savedName);
    setEmail(savedEmail);
    setPhone(savedPhone);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user_name", fullName);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_phone", phone);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 mb-10">
          <h1 className="font-display font-bold text-3xl text-slate-900">My Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Configure your personal credentials, addresses, and emergency security contacts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main profile form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSave} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
              <h2 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" /> Personal Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 focus:border-blue-600 focus:outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 focus:border-blue-600 focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 focus:border-blue-600 focus:outline-none text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Permanent Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 h-4.5 w-4.5" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:border-blue-600 focus:outline-none text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-display font-bold text-md text-slate-800 flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-blue-600" /> Emergency Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 focus:border-blue-600 focus:outline-none text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 px-4 focus:border-blue-600 focus:outline-none text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                {saveSuccess ? (
                  <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Credentials Saved Successfully!
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">Verify all inputs prior to saving.</span>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                >
                  <Save className="h-4 w-4" /> Save Profile
                </button>
              </div>
            </form>
          </div>

          {/* Cards sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-display font-bold text-md text-slate-800 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" /> Saved Payment Cards
              </h3>

              <div className="space-y-3 pt-2">
                {savedCards.map((card, idx) => (
                  <div key={idx} className="border border-slate-150 rounded-2xl p-4 flex justify-between items-center bg-brand-bg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-[8px] tracking-wider">
                        {card.brand.toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800">•••• •••• •••• {card.last4}</span>
                        <span className="text-[9px] text-slate-450 block font-medium">Expires {card.exp}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSavedCards(prev => prev.filter((_, i) => i !== idx))}
                      className="text-[10px] text-red-550 hover:underline cursor-pointer bg-transparent border-none font-bold"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => alert("Add Card flow initiated")}
                className="w-full py-2.5 border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-[11px] font-bold rounded-xl text-slate-600 transition-all cursor-pointer"
              >
                + Add New Card
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
