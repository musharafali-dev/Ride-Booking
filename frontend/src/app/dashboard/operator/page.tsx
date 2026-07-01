"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Compass, Plus, DollarSign, Users, Award, 
  Map, Calendar, Trash, CheckSquare, X 
} from "lucide-react";

interface Tour {
  id: string;
  title: string;
  duration: number;
  price: number;
  occupancy: number;
  maxSeats: number;
  itinerary: string;
  guide?: string;
}

export default function OperatorDashboard() {
  const [activeTab, setActiveTab] = useState("tours");
  const [tours, setTours] = useState<Tour[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Inputs
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [itinerary, setItinerary] = useState("");

  // Guide Management State
  const [guides, setGuides] = useState<string[]>([]);
  const [newGuide, setNewGuide] = useState("");

  useEffect(() => {
    setTours([
      {
        id: "t1",
        title: "Hunza Valley & Attabad Lake Adventure",
        duration: 7,
        price: 399,
        occupancy: 24,
        maxSeats: 30,
        itinerary: "Day 1: Travel to Chilas, Day 2: Karimabad, Day 3: Attabad Lake, Day 4: Khunjerab Pass...",
        guide: "Ali Khan"
      },
      {
        id: "t2",
        title: "Lahore Historical & Cultural Day Tour",
        duration: 1,
        price: 45,
        occupancy: 8,
        maxSeats: 15,
        itinerary: "Morning: Badshahi Mosque, Afternoon: Fort, Evening: Shalimar Gardens dinner...",
        guide: "Sarah Shah"
      }
    ]);

    setGuides(["Ali Khan", "Sarah Shah", "Noman Ahmed"]);
  }, []);

  const handleAddTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !duration || !price) return;
    const newT: Tour = {
      id: `t${Date.now()}`,
      title,
      duration: Number(duration),
      price: Number(price),
      occupancy: 0,
      maxSeats: 20,
      itinerary,
      guide: "Unassigned"
    };
    setTours(prev => [...prev, newT]);
    setShowAddModal(false);
    setTitle("");
    setDuration("");
    setPrice("");
    setItinerary("");
  };

  const handleAddGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuide) return;
    setGuides(prev => [...prev, newGuide]);
    setNewGuide("");
  };

  const assignGuide = (tourId: string, guideName: string) => {
    setTours(prev => prev.map(t => t.id === tourId ? { ...t, guide: guideName } : t));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Tour Management Desk</h1>
            <p className="text-slate-400 mt-1">Configure itinerary packages, monitor occupancy rates, and view operator revenues.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-sm font-semibold text-white transition-colors"
          >
            <Plus className="h-4.5 w-4.5" /> Create Tour Package
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Total Packages Hosted</span>
            <span className="text-3xl font-extrabold text-white">{tours.length} Packages</span>
          </div>

          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Total Booked Travelers</span>
            <span className="text-3xl font-extrabold text-indigo-400">
              {tours.reduce((acc, t) => acc + t.occupancy, 0)} Booked
            </span>
          </div>

          <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
            <span className="text-xs text-slate-500 block mb-1">Operator Net Revenue</span>
            <span className="text-3xl font-extrabold text-emerald-400">
              ${tours.reduce((acc, t) => acc + (t.occupancy * t.price), 0)}
            </span>
          </div>
        </div>

        {/* Tab Modules */}
        <div className="flex gap-2 border-b border-slate-850 pb-4 mb-8 overflow-x-auto">
          {["tours", "guides", "coasters"].map((tab) => (
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

        {/* Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* TOURS TAB */}
            {activeTab === "tours" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <Compass className="h-5 w-5 text-indigo-400" /> Active Tour Packages
                </h2>

                <div className="space-y-4">
                  {tours.map(t => {
                    const percentage = Math.round((t.occupancy / t.maxSeats) * 100);
                    return (
                      <div key={t.id} className="border border-slate-800 bg-[#0c0f17] p-6 rounded-3xl space-y-4 hover:border-slate-700 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-display font-bold text-xl text-white">{t.title}</h3>
                            <p className="text-xs text-slate-400 mt-1">{t.duration} Days &bull; Guide: <span className="text-indigo-400 font-semibold">{t.guide}</span></p>
                          </div>
                          <span className="text-lg font-bold text-white">${t.price}</span>
                        </div>

                        {/* Progress Bar for Occupancy */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">Occupancy Seating</span>
                            <span className="text-indigo-400">{t.occupancy} / {t.maxSeats} Booked ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Guide Assignment dropdown inside dashboard */}
                        <div className="flex items-center gap-3 pt-2">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Reassign Guide:</span>
                          <select 
                            value={t.guide}
                            onChange={(e) => assignGuide(t.id, e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-2 py-1 rounded focus:outline-none"
                          >
                            <option value="Unassigned">Unassigned</option>
                            {guides.map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GUIDES TAB */}
            {activeTab === "guides" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white">Tour Guides registry</h2>
                
                <form onSubmit={handleAddGuide} className="bg-[#0c0f17] border border-slate-800 p-6 rounded-2xl flex gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Enter Guide Name"
                    value={newGuide}
                    onChange={(e) => setNewGuide(e.target.value)}
                    className="flex-grow bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Add Guide
                  </button>
                </form>

                <div className="bg-[#0c0f17] border border-slate-800 rounded-2xl p-6 divide-y divide-slate-850">
                  {guides.map(g => (
                    <div key={g} className="py-3 flex justify-between items-center text-xs text-slate-350">
                      <span>{g}</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Active Duty</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COASTERS TAB */}
            {activeTab === "coasters" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white">Coaster Seating & Logistics</h2>
                <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Coaster BUS-5566 (Toyota Coaster)</span>
                    <span className="font-bold text-emerald-400">24 / 29 Booked</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-850 pt-3">
                    <span>Coaster BUS-9900 (Hyundai Universe Bus)</span>
                    <span className="font-bold text-emerald-400">8 / 45 Booked</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-indigo-400" /> Compliance Checklist
            </h2>
            <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl space-y-4 text-xs text-slate-450 leading-relaxed">
              <p>✓ All long-distance coaches must be equipped with working Air Conditioning.</p>
              <p>✓ Tour operators must assign a verified secondary local driver for multi-day trips exceeding 400km.</p>
              <p>✓ Maintain hotel reservation verification logs at least 48 hours prior to departures.</p>
            </div>
          </div>

        </div>

        {/* Modal: Create Tour */}
        {showAddModal && (
          <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-xl text-white">Create Tour Package</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddTour} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Hunza Discovery Tour"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      required
                      placeholder="7"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Price ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="399"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Itinerary Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Describe main daily sights..."
                    value={itinerary}
                    onChange={(e) => setItinerary(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 border border-slate-800 hover:bg-slate-800 text-slate-400 font-semibold rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    Publish Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
