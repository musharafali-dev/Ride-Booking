"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Navigation, Star, Award, Compass, Landmark, 
  MapPin, CheckCircle, Clock, ToggleLeft, ToggleRight 
} from "lucide-react";

interface Dispatch {
  id: string;
  client: string;
  pickup: string;
  destination: string;
  earning: number;
  status: "pending" | "accepted" | "rejected";
}

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState("trips");
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [online, setOnline] = useState(true);
  const [rating, setRating] = useState(4.9);
  const [revenue, setRevenue] = useState(380);

  useEffect(() => {
    setDispatches([
      { id: "DISP-001", client: "Jane Doe", pickup: "Gulberg III, Lahore", destination: "Allama Iqbal International Airport", earning: 25, status: "pending" },
      { id: "DISP-002", client: "Ali Khan", pickup: "DHA Phase 5, Lahore", destination: "Emporium Mall", earning: 18, status: "pending" }
    ]);
  }, []);

  const handleDispatchAction = (id: string, action: "accept" | "reject") => {
    setDispatches(prev => 
      prev.map(d => d.id === id ? { ...d, status: action === "accept" ? ("accepted" as const) : ("rejected" as const) } : d)
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900">Driver Workspace</h1>
            <p className="text-xs text-slate-500 mt-1">Accept city ride dispatches, update duties status, and review ratings metrics.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-550">Duty Status:</span>
            <button onClick={() => setOnline(!online)} className="cursor-pointer">
              {online ? (
                <ToggleRight className="h-10 w-10 text-emerald-500" />
              ) : (
                <ToggleLeft className="h-10 w-10 text-slate-350" />
              )}
            </button>
            <span className={`text-xs font-bold ${online ? "text-emerald-600" : "text-slate-400"}`}>
              {online ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Earnings</span>
            <span className="text-3xl font-extrabold text-slate-900">${revenue}</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Performance Rating</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-blue-600">{rating}</span>
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Trips</span>
            <span className="text-3xl font-extrabold text-slate-900">42 Trips</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dispatches Available</span>
            <span className="text-3xl font-extrabold text-amber-500">
              {dispatches.filter(d => d.status === "pending").length} Available
            </span>
          </div>
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Tab Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: "trips", label: "Ride Dispatches", icon: Navigation },
              { id: "earnings", label: "My Earnings", icon: Landmark },
              { id: "documents", label: "Verify Documents", icon: Award }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-650 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Main workspace */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* RIDE DISPATCHES TAB */}
            {activeTab === "trips" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-slate-800">Dispatch Queue</h2>

                <div className="space-y-4">
                  {dispatches.filter(d => d.status === "pending").length === 0 ? (
                    <div className="text-center py-12 bg-white border border-slate-100 rounded-3xl text-slate-450 text-xs">
                      All dispatches accepted. Queue: 0.
                    </div>
                  ) : (
                    dispatches.filter(d => d.status === "pending").map(d => (
                      <div key={d.id} className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-bold text-slate-455 uppercase block">Instant Booking &bull; {d.id}</span>
                            <h3 className="font-display font-bold text-md text-slate-850 mt-1">{d.client}</h3>
                          </div>
                          <span className="text-lg font-extrabold text-emerald-600">${d.earning}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500 border-y border-slate-50 py-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-800 block text-[9px] uppercase font-bold">Pick-up</strong>
                              {d.pickup}
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-800 block text-[9px] uppercase font-bold">Destination</strong>
                              {d.destination}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleDispatchAction(d.id, "reject")}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 rounded-xl cursor-pointer"
                          >
                            Reject Job
                          </button>
                          <button 
                            onClick={() => handleDispatchAction(d.id, "accept")}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                          >
                            Accept Ride
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* MY EARNINGS TAB */}
            {activeTab === "earnings" && (
              <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
                <h2 className="font-display font-bold text-lg text-slate-800">Earnings Log</h2>
                
                {/* SVG Earnings chart */}
                <div className="space-y-2">
                  <div className="h-40 w-full flex items-end justify-between border-b border-l border-slate-150 pl-4 pb-2">
                    {[50, 75, 45, 90, 110, 60, 80].map((val, idx) => (
                      <div key={idx} className="w-8 bg-blue-600 rounded-t-lg flex flex-col justify-end" style={{ height: `${val}%` }}>
                        <span className="text-[9px] text-white font-bold mb-1 text-center">${val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold px-4 pt-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            )}

            {/* VERIFY DOCUMENTS */}
            {activeTab === "documents" && (
              <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-800">Verification Credentials</h2>
                  <p className="text-xs text-slate-400 mt-1">Upload and configure your Commercial Chauffeur Driver License credentials.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="border border-slate-150 rounded-2xl p-4 flex justify-between items-center bg-brand-bg">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Driver License (DL-PK-998822)</span>
                      <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
