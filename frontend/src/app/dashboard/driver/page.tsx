"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Award, MapPin, DollarSign, Calendar, Navigation, 
  User, CheckCircle, AlertCircle, RefreshCw, BarChart2 
} from "lucide-react";

interface Job {
  id: string;
  customer: string;
  pickup: string;
  destination: string;
  amount: number;
  status: "pending" | "accepted" | "started" | "completed";
}

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState("trips");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [earnings, setEarnings] = useState(380.00);
  
  // Availability scheduler state
  const [driverAvailable, setDriverAvailable] = useState(true);

  useEffect(() => {
    setJobs([
      {
        id: "JOB-771",
        customer: "Jane Doe",
        pickup: "Islamabad International Airport",
        destination: "Marriott Hotel Islamabad",
        amount: 35.00,
        status: "pending"
      },
      {
        id: "JOB-402",
        customer: "Robert Chen",
        pickup: "Rawalpindi Saddar Station",
        destination: "Giga Mall DHA-2",
        amount: 25.00,
        status: "completed"
      }
    ]);
  }, []);

  const handleJobAction = (id: string, action: "accept" | "decline" | "start" | "complete") => {
    setJobs(prev => 
      prev.map(j => {
        if (j.id === id) {
          if (action === "accept") return { ...j, status: "accepted" as const };
          if (action === "start") return { ...j, status: "started" as const };
          if (action === "complete") {
            setEarnings(prevE => prevE + j.amount);
            return { ...j, status: "completed" as const };
          }
        }
        return j;
      }).filter(j => !(j.id === id && action === "decline"))
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="border-b border-slate-800 pb-8 mb-10">
          <h1 className="font-display font-bold text-3xl text-white">Driver Workspace</h1>
          <p className="text-slate-400 mt-1">Accept city ride jobs, navigate routes, and review performance metrics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl text-center">
            <Award className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
            <span className="text-xs text-slate-500 block mb-1">Driver Rating</span>
            <span className="text-3xl font-extrabold text-white">4.92 / 5.0</span>
          </div>

          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl text-center">
            <DollarSign className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <span className="text-xs text-slate-500 block mb-1">Earnings This Month</span>
            <span className="text-3xl font-extrabold text-emerald-400">${earnings.toFixed(2)}</span>
          </div>

          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl text-center">
            <Navigation className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
            <span className="text-xs text-slate-500 block mb-1">Total Trips Completed</span>
            <span className="text-3xl font-extrabold text-white">48 Trips</span>
          </div>
        </div>

        {/* Tab Modules */}
        <div className="flex gap-2 border-b border-slate-850 pb-4 mb-8 overflow-x-auto">
          {["trips", "availability", "earnings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeTab === tab 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Driver Job Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* TRIPS TAB */}
            {activeTab === "trips" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-indigo-400 animate-pulse" /> Active Dispatches
                </h2>

                <div className="space-y-4">
                  {jobs.filter(j => j.status !== "completed").length === 0 ? (
                    <div className="border border-slate-850 p-8 rounded-2xl text-center text-slate-500 text-sm">
                      Waiting for active ride requests...
                    </div>
                  ) : (
                    jobs.filter(j => j.status !== "completed").map(j => (
                      <div key={j.id} className="border border-slate-800 bg-[#0c0f17] p-6 rounded-3xl space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs text-indigo-400 font-mono block mb-1">{j.id}</span>
                            <h3 className="font-display font-bold text-lg text-white">Ride for {j.customer}</h3>
                          </div>
                          <span className="text-lg font-bold text-white">${j.amount.toFixed(2)}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400 bg-slate-900/50 p-4 rounded-xl border border-slate-850">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase block">Pickup Location</span>
                            <span className="font-semibold text-slate-300 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" /> {j.pickup}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase block">Destination Location</span>
                            <span className="font-semibold text-slate-300 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" /> {j.destination}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                          {j.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleJobAction(j.id, "decline")}
                                className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-400 rounded-lg transition-colors"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => handleJobAction(j.id, "accept")}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg transition-colors"
                              >
                                Accept Job
                              </button>
                            </>
                          )}
                          {j.status === "accepted" && (
                            <button
                              onClick={() => handleJobAction(j.id, "start")}
                              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg transition-colors"
                            >
                              Start Ride / Navigate
                            </button>
                          )}
                          {j.status === "started" && (
                            <button
                              onClick={() => handleJobAction(j.id, "complete")}
                              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-lg transition-colors"
                            >
                              Complete Trip
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* AVAILABILITY TAB */}
            {activeTab === "availability" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white">Availability Scheduler</h2>
                <div className="bg-[#0c0f17] border border-slate-800 p-6 rounded-2xl space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-white text-sm">Duty Status</h4>
                      <p className="text-xs text-slate-500 mt-1">Accept dispatches immediately</p>
                    </div>
                    
                    <button
                      onClick={() => setDriverAvailable(!driverAvailable)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                        driverAvailable ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {driverAvailable ? "Active / Online" : "Inactive / Offline"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EARNINGS TAB */}
            {activeTab === "earnings" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white">Earnings Charts</h2>
                
                {/* SVG Payout history */}
                <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400">Weekly Earnings Metrics</h3>
                  <div className="flex items-end justify-between h-40 pt-4 border-b border-slate-850">
                    {[120, 240, 180, 310, 280, 390, 420].map((val, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <span className="text-[9px] text-emerald-400 font-mono font-semibold">${val}</span>
                        <div className="w-6 bg-emerald-600/30 border border-emerald-500/50 hover:bg-emerald-500 transition-colors rounded-t-md" style={{ height: `${val * 0.3}px` }}></div>
                        <span className="text-[9px] text-slate-500 uppercase">Day {i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-white">Trip Log</h2>
            <div className="space-y-4">
              {jobs.filter(j => j.status === "completed").map(j => (
                <div key={j.id} className="border border-slate-850 bg-[#0c0f17] p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm">Ride to {j.destination.split(" ")[0]}</h4>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Customer: {j.customer}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">+${j.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
