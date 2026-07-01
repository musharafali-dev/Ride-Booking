"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Car, Shield, Users, Landmark, DollarSign, Calendar, 
  Trash, CheckCircle, X, ChevronRight, BarChart3, AlertCircle 
} from "lucide-react";

interface Listing {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  status: "available" | "rented" | "maintenance";
}

interface Request {
  id: string;
  client: string;
  vehicle: string;
  dates: string;
  earning: number;
}

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  
  // Create state inputs
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("car_rental");
  const [price, setPrice] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    setListings([
      { id: "v1", make: "Toyota", model: "Corolla", category: "car_rental", price: 40, status: "available" },
      { id: "v2", make: "Honda", model: "Civic", category: "car_rental", price: 45, status: "available" },
      { id: "v3", make: "BMW", model: "X5", category: "luxury", price: 220, status: "rented" }
    ]);

    setRequests([
      { id: "req-1", client: "David Navigator", vehicle: "Toyota Corolla", dates: "July 05 - July 07", earning: 80 },
      { id: "req-2", client: "Sarah Shah", vehicle: "BMW X5", dates: "July 10 - July 12", earning: 440 }
    ]);
  }, []);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !price) return;
    const newV: Listing = {
      id: `v${Date.now()}`,
      make,
      model,
      category,
      price: Number(price),
      status: "available"
    };
    setListings(prev => [...prev, newV]);
    setShowAddModal(false);
    setMake("");
    setModel("");
    setPrice("");
  };

  const handleDeleteVehicle = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const handleAction = (id: string, accept: boolean) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    alert(`Rental request ${accept ? "accepted" : "rejected"} successfully.`);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) return;
    setWithdrawSuccess(true);
    setWithdrawAmount("");
    setTimeout(() => setWithdrawSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900">Fleet & Earnings Control</h1>
            <p className="text-xs text-slate-500 mt-1">Manage listings, accept customer rentals, and review earnings statistics.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
          >
            + Add New Vehicle
          </button>
        </div>

        {/* Dynamic Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Revenue</span>
            <span className="text-3xl font-extrabold text-slate-900">$2,450.00</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fleet Utilization</span>
            <span className="text-3xl font-extrabold text-blue-600">82%</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Bookings</span>
            <span className="text-3xl font-extrabold text-slate-900">3 Rentals</span>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Requests</span>
            <span className="text-3xl font-extrabold text-amber-500">{requests.length} Requests</span>
          </div>
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Tab Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: "vehicles", label: "My Fleet", icon: Car },
              { id: "requests", label: "Booking Requests", icon: Calendar },
              { id: "withdrawals", label: "Withdraw Funds", icon: Landmark },
              { id: "analytics", label: "Earnings Stats", icon: BarChart3 }
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
            
            {/* MY FLEET PANEL */}
            {activeTab === "vehicles" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-slate-800">Vehicle Listings</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {listings.map(l => (
                    <div key={l.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:border-slate-200 transition-colors group">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-display font-bold text-md text-slate-900 group-hover:text-blue-600 transition-colors">
                              {l.make} {l.model}
                            </h3>
                            <span className="text-[10px] text-slate-400 capitalize block mt-0.5 font-bold tracking-wider">{l.category.replace("_", " ")}</span>
                          </div>
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            l.status === "available" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                          }`}>
                            {l.status}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-6 border-t border-slate-50 pt-4">
                          <span className="text-sm font-extrabold text-slate-850">${l.price} <span className="text-xs text-slate-400 font-normal">/day</span></span>
                          <button
                            onClick={() => handleDeleteVehicle(l.id)}
                            className="p-1.5 rounded bg-red-50 text-red-650 border border-red-100 hover:bg-red-100 cursor-pointer"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REQUESTS PANEL */}
            {activeTab === "requests" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-slate-800">Pending Checkout Requests</h2>

                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-slate-100 rounded-3xl text-slate-450 text-xs">
                      No pending requests.
                    </div>
                  ) : (
                    requests.map(r => (
                      <div key={r.id} className="bg-white border border-slate-100 p-6 rounded-3xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow-sm">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase block">From: {r.client}</span>
                          <h3 className="font-display font-bold text-md text-slate-850 mt-1">{r.vehicle}</h3>
                          <span className="text-xs text-slate-550 block mt-0.5">{r.dates} &bull; Expected payout: <strong className="text-emerald-600">${r.earning}</strong></span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAction(r.id, false)}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 rounded-xl cursor-pointer"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => handleAction(r.id, true)}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
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

            {/* WITHDRAWALS PANEL */}
            {activeTab === "withdrawals" && (
              <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-800">Withdraw Fleet Earnings</h2>
                  <p className="text-xs text-slate-400 mt-1">Transfer your active wallet balance directly into your bank or mobile wallet.</p>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Amount to Withdraw ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 500"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>

                  {withdrawSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      Payout request submitted successfully. Processing time: 24h.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm"
                  >
                    Withdraw Funds
                  </button>
                </form>
              </div>
            )}

            {/* ANALYTICS PANEL */}
            {activeTab === "analytics" && (
              <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
                <h2 className="font-display font-bold text-lg text-slate-800">Earnings & Bookings Charts</h2>
                
                {/* SVG utilisation graph */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-4">Weekly Fleet Utilization Rate</span>
                  <div className="h-48 w-full flex items-end justify-between pt-6 border-b border-l border-slate-150 pl-4 pb-2">
                    {[65, 80, 72, 85, 90, 82, 88].map((val, idx) => (
                      <div key={idx} className="w-8 bg-blue-600 rounded-t-lg transition-all hover:bg-blue-500 flex flex-col items-center justify-end" style={{ height: `${val}%` }}>
                        <span className="text-[9px] text-white font-bold mb-1">{val}%</span>
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

          </div>

        </div>

        {/* Modal: Create Vehicle */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-xl text-slate-900">Add New Vehicle</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-450 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Make</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Toyota"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Model</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Corolla"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="car_rental">Car Rental</option>
                    <option value="luxury">Luxury Car</option>
                    <option value="bike_rental">Bike Rental</option>
                    <option value="bus_coaster">Buses / Coasters</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Daily Price ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                  >
                    Publish Vehicle
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
