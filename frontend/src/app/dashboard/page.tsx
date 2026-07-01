"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Wallet, Car, Calendar, PlusCircle, CheckCircle, User, 
  MapPin, DollarSign, Award, Settings, Trash, Eye 
} from "lucide-react";

export default function Dashboard() {
  const [role, setRole] = useState("customer");
  const [walletBalance, setWalletBalance] = useState(500);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [ownerVehicles, setOwnerVehicles] = useState<any[]>([]);

  // Add new vehicle inputs (for Owner view)
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("car_rental");

  useEffect(() => {
    const savedRole = localStorage.getItem("user_role") || "customer";
    setRole(savedRole);

    // Mock active bookings
    setBookings([
      {
        id: "BK-1002",
        type: "rental",
        details: "Toyota Corolla Hybrid",
        date: "July 2, 2026 - July 5, 2026",
        amount: 150,
        status: "active"
      },
      {
        id: "BK-3042",
        type: "tour",
        details: "Hunza Valley Adventure",
        date: "July 12, 2026 - July 19, 2026",
        amount: 399,
        status: "pending"
      }
    ]);

    // Mock Owner's Fleet
    setOwnerVehicles([
      { id: "ov1", make: "Toyota", model: "Corolla", category: "car_rental", price: 50, status: "available" },
      { id: "ov2", make: "Mercedes-Benz", model: "S-Class", category: "luxury", price: 250, status: "rented" }
    ]);
  }, []);

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountToAdd || isNaN(Number(amountToAdd))) return;
    setWalletBalance(prev => prev + Number(amountToAdd));
    setAmountToAdd("");
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !price) return;
    const newVehicle = {
      id: `ov${Date.now()}`,
      make,
      model,
      category,
      price: Number(price),
      status: "available"
    };
    setOwnerVehicles(prev => [newVehicle, ...prev]);
    setMake("");
    setModel("");
    setPrice("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#07090e]">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-8 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Unified Workspace</h1>
            <p className="text-slate-400 mt-1 capitalize">Role: {role} Mode</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4 bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl">
            <Wallet className="h-5 w-5 text-indigo-400" />
            <div>
              <span className="text-xs text-slate-500 block leading-none mb-1">Wallet Balance</span>
              <span className="font-bold text-white">${walletBalance}</span>
            </div>
          </div>
        </div>

        {/* ---------------- CUSTOMER VIEW ---------------- */}
        {role === "customer" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Active Bookings */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-400" /> Active & Upcoming Bookings
              </h2>

              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b.id} className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-indigo-400 font-mono tracking-wider block mb-1">{b.id}</span>
                      <h3 className="font-display font-semibold text-lg text-white capitalize">{b.details}</h3>
                      <p className="text-sm text-slate-400 mt-1">{b.date}</p>
                    </div>
                    <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-slate-800/80 pt-4 sm:pt-0">
                      <div className="text-right">
                        <span className="text-base font-bold text-white">${b.amount}</span>
                        <span className="text-xs text-slate-500 block capitalize">{b.type}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${
                        b.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Panel */}
            <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8 self-start">
              <h3 className="font-display font-bold text-lg text-white mb-6">Manage Wallet</h3>
              <form onSubmit={handleAddFunds} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Amount to Add ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Load Funds
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- OWNER VIEW ---------------- */}
        {role === "owner" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* My Fleet List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <Car className="h-5 w-5 text-indigo-400" /> Fleet Management
              </h2>

              <div className="space-y-4">
                {ownerVehicles.map((v) => (
                  <div key={v.id} className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-lg text-white">{v.make} {v.model}</h3>
                      <p className="text-xs text-slate-400 capitalize mt-1">{v.category.replace("_", " ")}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-base font-bold text-white">${v.price}/day</span>
                        <span className="text-[10px] text-slate-500 block capitalize">{v.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List New Vehicle Form */}
            <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8 self-start">
              <h3 className="font-display font-bold text-lg text-white mb-6">List a Vehicle</h3>
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Make</label>
                  <input
                    type="text"
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
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
                >
                  List Vehicle
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- DRIVER VIEW ---------------- */}
        {role === "driver" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-800 bg-[#0c0f17] p-8 rounded-3xl text-center">
                <Award className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg text-white">Driver Performance</h3>
                <p className="text-3xl font-extrabold text-white mt-2">4.92</p>
                <p className="text-xs text-slate-500 mt-1">Average rating from 48 reviews</p>
              </div>

              <div className="border border-slate-800 bg-[#0c0f17] p-8 rounded-3xl text-center">
                <DollarSign className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg text-white">Completed Trips Earnings</h3>
                <p className="text-3xl font-extrabold text-white mt-2">$840.50</p>
                <p className="text-xs text-slate-500 mt-1">This month earnings</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl text-white">My Active Assignments</h2>
              <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-semibold">City Ride Job</span>
                  <h3 className="font-display font-semibold text-lg text-white mt-2">Airport Pickup for Customer Jane</h3>
                  <p className="text-sm text-slate-400 mt-1">Pickup: Islamabad Int. Airport &bull; Destination: Centaurus Mall</p>
                </div>
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg transition-colors">
                  Start Ride
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- OPERATOR VIEW ---------------- */}
        {role === "operator" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="font-display font-bold text-xl text-white">Occupancy & Booking Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
                <span className="text-xs text-slate-500 block mb-1">Active Tours</span>
                <span className="text-2xl font-bold text-white">12 Tours</span>
              </div>
              <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
                <span className="text-xs text-slate-500 block mb-1">Booked Seats</span>
                <span className="text-2xl font-bold text-white">92 / 120 Seats</span>
              </div>
              <div className="border border-slate-800 bg-[#0c0f17] p-6 rounded-2xl">
                <span className="text-xs text-slate-500 block mb-1">Total Bookings Revenue</span>
                <span className="text-2xl font-bold text-white">$4,820</span>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- ADMIN VIEW ---------------- */}
        {role === "admin" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="font-display font-bold text-xl text-white">System Administration</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-slate-800 bg-[#0c0f17] p-4 rounded-xl text-center">
                <span className="text-xs text-slate-500 block">Total Users</span>
                <span className="text-xl font-bold text-white">1,482</span>
              </div>
              <div className="border border-slate-800 bg-[#0c0f17] p-4 rounded-xl text-center">
                <span className="text-xs text-slate-500 block">Vehicles Online</span>
                <span className="text-xl font-bold text-white">82</span>
              </div>
              <div className="border border-slate-800 bg-[#0c0f17] p-4 rounded-xl text-center">
                <span className="text-xs text-slate-500 block">Active Bookings</span>
                <span className="text-xl font-bold text-white">35</span>
              </div>
              <div className="border border-slate-800 bg-[#0c0f17] p-4 rounded-xl text-center">
                <span className="text-xs text-slate-500 block">System Health</span>
                <span className="text-xl font-bold text-emerald-400">99.9%</span>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
