"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { 
  Settings, Shield, Bell, Lock, Globe, 
  Trash2, ToggleLeft, ToggleRight, Check, AlertTriangle 
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  
  // Toggles
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("en");

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    // Simulate toggling dark class in html
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteAccount = () => {
    const conf = confirm("WARNING: Are you absolutely sure you want to permanently delete your RideSphere account? This action is irreversible.");
    if (conf) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 mb-10">
          <h1 className="font-display font-bold text-3xl text-slate-900">Account Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Configure your notification preferences, credentials security, and layout options.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Settings Tabs Sidebar */}
          <div className="space-y-1">
            {[
              { id: "account", label: "Account Options", icon: Settings },
              { id: "security", label: "Security & 2FA", icon: Shield },
              { id: "notifications", label: "Notifications Settings", icon: Bell },
              { id: "theme", label: "Theme & Language", icon: Globe }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Main workspace */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
              
              {/* ACCOUNT OPTIONS */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-800">Account Preferences</h2>
                    <p className="text-xs text-slate-400 mt-1">Manage global system parameters.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Simulate Offline Mode</span>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">Runs dashboard layouts with mock state data when APIs fail.</p>
                      </div>
                      <button onClick={() => {}} className="text-slate-400 hover:text-slate-650 cursor-pointer">
                        <ToggleRight className="h-9 w-9 text-blue-600" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-red-100 pt-6">
                    <h3 className="text-xs font-bold text-red-600 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="h-4.5 w-4.5" /> Danger Zone
                    </h3>
                    <p className="text-[10px] text-slate-450 mb-4 leading-relaxed">
                      Deleting your profile removes wallet histories, saved cards, listings, and ongoing rentals permanently.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-4 w-4" /> Delete My Account
                    </button>
                  </div>
                </div>
              )}

              {/* SECURITY & 2FA */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-800">Security Policies</h2>
                    <p className="text-xs text-slate-400 mt-1">Configure verification keys and passwords.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Two-Factor Authentication (2FA)</span>
                        <p className="text-[10px] text-slate-455 mt-0.5 leading-relaxed">Protects wallet funds with an OTP verification check on login.</p>
                      </div>
                      <button onClick={() => setTwoFactor(!twoFactor)} className="cursor-pointer">
                        {twoFactor ? (
                          <ToggleRight className="h-9 w-9 text-blue-600" />
                        ) : (
                          <ToggleLeft className="h-9 w-9 text-slate-300" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Update Password</span>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-600 text-xs font-medium"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-600 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS SETTINGS */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-800">Notification Alerts</h2>
                    <p className="text-xs text-slate-400 mt-1">Configure where and when you receive ride notifications.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Push Notifications</span>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">Receive updates for nearby vehicles and active rentals.</p>
                      </div>
                      <button onClick={() => setPushNotifs(!pushNotifs)} className="cursor-pointer">
                        {pushNotifs ? (
                          <ToggleRight className="h-9 w-9 text-blue-600" />
                        ) : (
                          <ToggleLeft className="h-9 w-9 text-slate-300" />
                        )}
                      </button>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Email Newsletters & Invoices</span>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">Receive receipt receipts and booking statements immediately via mail.</p>
                      </div>
                      <button onClick={() => setEmailNotifs(!emailNotifs)} className="cursor-pointer">
                        {emailNotifs ? (
                          <ToggleRight className="h-9 w-9 text-blue-600" />
                        ) : (
                          <ToggleLeft className="h-9 w-9 text-slate-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* THEME & LANGUAGE */}
              {activeTab === "theme" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-800">Theme & Language Settings</h2>
                    <p className="text-xs text-slate-400 mt-1">Customize language preferences and visual styling.</p>
                  </div>

                  <div className="space-y-5 pt-2">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Enable Dark Mode</span>
                        <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">Render layouts in dark colors.</p>
                      </div>
                      <button onClick={() => setDarkMode(!darkMode)} className="cursor-pointer">
                        {darkMode ? (
                          <ToggleRight className="h-9 w-9 text-blue-600" />
                        ) : (
                          <ToggleLeft className="h-9 w-9 text-slate-300" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">System Language</label>
                        <select
                          value={lang}
                          onChange={(e) => setLang(e.target.value)}
                          className="w-full bg-brand-bg border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:outline-none"
                        >
                          <option value="en">English (US)</option>
                          <option value="ur">Urdu (اردو)</option>
                          <option value="ar">Arabic (العربية)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                {saveSuccess ? (
                  <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Preferences updated successfully!
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">Verify preferences prior to save.</span>
                )}
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                >
                  Save Settings
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
