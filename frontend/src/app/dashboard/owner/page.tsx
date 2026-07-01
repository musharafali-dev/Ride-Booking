"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Car, Plus, DollarSign, Calendar, TrendingUp, CheckCircle, 
  AlertTriangle, Hammer, X, BarChart2, Briefcase, FileText 
} from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  status: "available" | "rented" | "maintenance";
  nextCheck: string;
}

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [earnings, setEarnings] = useState(1480);
  const [requests, setRequests] = useState<any[]>([]);

  // Add Vehicle Inputs
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("car_rental");
  const [price, setPrice] = useState("");

  useEffect(() => {
    setVehicles([
      { id: "ov1", make: "Toyota", model: "Corolla", category: "car_rental", price: 50, status: "available", nextCheck: "July 24, 2026" },
      { id: "ov2", make: "Mercedes-Benz", model: "S-Class", category: "luxury", price: 250, status: "rented", nextCheck: "Aug 15, 2026" },
      { id: "ov3", make: "Honda", model: "CB500X", category: "bike_rental", price: 35, status: "maintenance", nextCheck: "In Progress" }
    ]);

    setRequests([
      {
        id: "REQ-01",
        customer: "Jane Doe",
        vehicle: "Toyota Corolla",
        dates: "July 8 - July 10",
        amount: 100
      },
      {
        id: "REQ-02",
        customer: "Arthur Pendragon",
        vehicle: "Mercedes S-Class",
        dates: "July 15 - July 18",
        amount: 750
      }
    ]);
  }, []);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !price) return;
    const newV: Vehicle = {
      id: `ov${Date.now()}`,
      make,
      model,
      category,
      price: Number(price),
      status: "available",
      nextCheck: "Aug 1, 2026"
    };
    setVehicles(prev => [newV, ...prev]);
    setShowAddModal(false);
    setMake("");
    setModel("");
    setPrice("");
  };

  const handleRequestAction = (id: string, action: "accept" | "reject") => {
    if (action === "accept") {
      const req = requests.find(r => r.id === id);
      if (req) {
        setEarnings(prev => prev + req.amount);
      }
    }
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Fleet & Earnings Control</h1>
            <p className="text-slate-400 mt-1">Manage listings, accept customer rentals, and review earnings statistics.</p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-sm font-semibold text-white transition-colors"
          >
            <Plus className="h-4.5 w-4.5" /> List a Vehicle
          </button>
        </div>

        {/* Tab Modules */}
        <div className="flex gap-2 border-b border-slate-850 pb-4 mb-8 overflow-x-auto">
          {["vehicles", "earnings", "bookings", "analytics"].map((tab) => (
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
            
            {/* VEHICLES TAB */}
            {activeTab === "vehicles" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <Car className="h-5 w-5 text-indigo-400" /> Managed Fleet
                </h2>

                <div className="space-y-4">
                  {vehicles.map(v => (
                    <div key={v.id} className="border border-slate-800 bg-[#0c0f17] p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700 transition-colors">
                      <div>
                        <h3 className="font-display font-bold text-lg text-white">{v.make} {v.model}</h3>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
                          <span className="capitalize">{v.category.replace("_", " ")}</span>
                          <span>&bull;</span>
                          <span>Next Checkup: {v.nextCheck}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                        <div className="text-right">
                          <span className="text-base font-bold text-white">${v.price}/day</span>
                          <span className="text-[10px] text-slate-500 block">Payout value</span>
                        </div>

                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize border ${
                          v.status === "available" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : v.status === "rented"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {v.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EARNINGS TAB */}
            {activeTab === "earnings" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white">Earnings Ledger</h2>
                <div className="bg-[#0c0f17] border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-850 pb-3">
                    <span>Payout for S-Class Rental</span>
                    <span className="font-bold text-emerald-400">+$750.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Payout for Corolla Rental</span>
                    <span className="font-bold text-emerald-400">+$100.00</span>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white">Pending Requests</h2>
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <div className="border border-slate-850 p-6 rounded-2xl text-center text-slate-500 text-sm">
                      No pending booking requests.
                    </div>
                  ) : (
                    requests.map(r => (
                      <div key={r.id} className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs text-slate-500 block">Customer</span>
                            <span className="font-semibold text-white text-sm">{r.customer}</span>
                          </div>
                          <span className="text-sm font-bold text-white">${r.amount}</span>
                        </div>
                        
                        <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-850">
                          <div><strong className="text-slate-300">Vehicle:</strong> {r.vehicle}</div>
                          <div className="mt-1"><strong className="text-slate-300">Dates:</strong> {r.dates}</div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRequestAction(r.id, "reject")}
                            className="flex-1 py-2 border border-slate-800 hover:bg-slate-800 text-xs font-semibold rounded-lg text-rose-400 transition-colors"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleRequestAction(r.id, "accept")}
                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg text-white transition-colors"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white">Fleet Performance Analytics</h2>
                
                {/* SVG Fleet occupancy utilization chart */}
                <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400">Weekly Fleet Utilization</h3>
                  <div className="flex items-end justify-between h-40 pt-4 border-b border-slate-850">
                    {[65, 45, 80, 50, 75, 90, 85].map((val, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <span className="text-[10px] text-indigo-400 font-mono font-semibold">{val}%</span>
                        <div className="w-6 bg-indigo-600/30 border border-indigo-500/50 hover:bg-indigo-500 transition-colors rounded-t-md" style={{ height: `${val * 1.2}px` }}></div>
                        <span className="text-[9px] text-slate-500 uppercase">W{i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Alerts & Actions */}
          <div className="space-y-8">
            <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8">
              <h3 className="font-display font-bold text-lg text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" /> Maintenance Alerts
              </h3>
              <div className="space-y-4">
                <div className="text-xs text-slate-400 border-b border-slate-850 pb-4">
                  <span className="text-amber-400 font-semibold block mb-1">Honda CB500X</span>
                  Oil and filter service scheduled for tomorrow morning.
                </div>
                <div className="text-xs text-slate-400">
                  <span className="text-emerald-400 font-semibold block mb-1">Mercedes S-Class</span>
                  Brake inspection completed. Verified for standard operations.
                </div>
              </div>
            </div>

            <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Accrued Balance</span>
                <span className="text-2xl font-extrabold text-emerald-400">${earnings}</span>
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-xl text-white transition-colors">
                Request Payout
              </button>
            </div>
          </div>

        </div>

        {/* Modal: List Vehicle */}
        {showAddModal && (
          <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-xl text-white">List a Vehicle</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Make</label>
                  <input
                    type="text"
                    required
                    placeholder="Toyota, Honda, etc."
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="Civic, Corolla, etc."
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Price per Day ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="car_rental">Car Rental</option>
                    <option value="luxury">Luxury Car</option>
                    <option value="bike_rental">Bike Rental</option>
                    <option value="bus_coaster">Buses / Coasters</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors mt-2"
                >
                  Confirm Registration
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
