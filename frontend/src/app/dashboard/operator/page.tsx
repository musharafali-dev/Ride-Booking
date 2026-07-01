"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Compass, Users, Map, Landmark, Plus, 
  Calendar, CheckCircle, Award, Settings, Trash, X 
} from "lucide-react";

interface Tour {
  id: string;
  title: string;
  duration: number;
  price: number;
  occupancy: number;
  maxSeats: number;
  guide: string;
  status: "active" | "draft";
}

export default function OperatorDashboard() {
  const [activeTab, setActiveTab] = useState("packages");
  const [tours, setTours] = useState<Tour[]>([]);
  const [guides, setGuides] = useState<string[]>([]);
  const [newGuide, setNewGuide] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Inputs
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [selectedGuide, setSelectedGuide] = useState("");

  useEffect(() => {
    setTours([
      { id: "t1", title: "Hunza Valley Adventure", duration: 7, price: 399, occupancy: 24, maxSeats: 29, guide: "Ali Khan", status: "active" },
      { id: "t2", title: "Skardu Expedition", duration: 5, price: 450, occupancy: 12, maxSeats: 15, guide: "Noman Ahmed", status: "active" }
    ]);
    setGuides(["Ali Khan", "Noman Ahmed", "Sarah Shah"]);
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
      guide: selectedGuide || "Unassigned",
      status: "active"
    };
    setTours(prev => [...prev, newT]);
    setShowAddModal(false);
    setTitle("");
    setDuration("");
    setPrice("");
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
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900">Tour Operations Desk</h1>
            <p className="text-xs text-slate-500 mt-1">Configure itinerary packages, assign local guides, and track group departures.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
          >
            + Create Tour Package
          </button>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Hosted Packages</span>
            <span className="text-3xl font-extrabold text-slate-900">{tours.length} Tours</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Seating Occupancy</span>
            <span className="text-3xl font-extrabold text-blue-600">81%</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operator Revenue</span>
            <span className="text-3xl font-extrabold text-slate-900">
              ${tours.reduce((acc, t) => acc + (t.price * t.occupancy), 0)}
            </span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming Departures</span>
            <span className="text-3xl font-extrabold text-amber-500">2 Departures</span>
          </div>
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Tab Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: "packages", label: "Tours & Packages", icon: Compass },
              { id: "guides", label: "Guides Registry", icon: Users },
              { id: "logistics", label: "Vehicles & Coasters", icon: Map }
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
            
            {/* PACKAGES TAB */}
            {activeTab === "packages" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-slate-800">Active Tourism Packages</h2>

                <div className="space-y-4">
                  {tours.map(t => {
                    const percentage = Math.round((t.occupancy / t.maxSeats) * 100);
                    return (
                      <div key={t.id} className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm hover:border-slate-200 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-display font-bold text-lg text-slate-900">{t.title}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {t.duration} Days &bull; Guide: <strong className="text-blue-600">{t.guide}</strong>
                            </p>
                          </div>
                          <span className="text-lg font-extrabold text-slate-955">${t.price}</span>
                        </div>

                        {/* Progress Bar for Occupancy */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-400">Coaster Seating Occupancy</span>
                            <span className="text-blue-600">{t.occupancy} / {t.maxSeats} Booked ({percentage}%)</span>
                          </div>
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Assignment select */}
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assign Guide:</span>
                          <select 
                            value={t.guide}
                            onChange={(e) => assignGuide(t.id, e.target.value)}
                            className="bg-brand-bg border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none"
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
                <h2 className="font-display font-bold text-lg text-slate-800">Tour Guides Directory</h2>

                <form onSubmit={handleAddGuide} className="bg-white border border-slate-100 p-6 rounded-3xl flex gap-3 shadow-sm">
                  <input
                    type="text"
                    required
                    placeholder="Enter full name of guide"
                    value={newGuide}
                    onChange={(e) => setNewGuide(e.target.value)}
                    className="grow bg-brand-bg border border-slate-200 text-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-600 font-semibold"
                  />
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    Add Guide
                  </button>
                </form>

                <div className="bg-white border border-slate-100 rounded-3xl p-6 divide-y divide-slate-50 shadow-sm">
                  {guides.map(g => (
                    <div key={g} className="py-3 flex justify-between items-center text-xs font-semibold text-slate-750">
                      <span>{g}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-full">Active Status</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOGISTICS TAB */}
            {activeTab === "logistics" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-slate-800">Coaster Seating & Transport</h2>
                <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4 shadow-sm">
                  <div className="flex justify-between items-center text-xs font-semibold border-b border-slate-50 pb-3">
                    <span className="text-slate-800">Toyota Coaster (BUS-5566)</span>
                    <span className="text-blue-600">24 / 29 Seating Booked</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-800">Hyundai Universe Bus (BUS-9900)</span>
                    <span className="text-blue-600">12 / 45 Seating Booked</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal: Create Tour */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-xl text-slate-900">Create Tour Package</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-450 hover:text-slate-750">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddTour} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Hunza Discovery Tour"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      required
                      placeholder="7"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Price per Seat ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="399"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Assign Initial Guide</label>
                  <select
                    value={selectedGuide}
                    onChange={(e) => setSelectedGuide(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="">Choose Guide</option>
                    {guides.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
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
