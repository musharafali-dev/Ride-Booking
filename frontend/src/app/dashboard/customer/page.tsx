"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  User, Calendar, CreditCard, Star, MessageSquare, 
  Bell, Heart, Settings, HelpCircle, ArrowUpRight, ArrowDownRight, Compass, Shield 
} from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  type: string;
  vehicle: string;
  date: string;
  price: number;
  status: "active" | "completed" | "upcoming";
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [balance, setBalance] = useState(1200.0);
  const [spending, setSpending] = useState(450.0);
  const [rewards, setRewards] = useState(250);

  // Support inputs
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  useEffect(() => {
    setBookings([
      { id: "BK-9901", type: "Car Rental", vehicle: "Porsche 911 Carrera", date: "July 12 - July 15", price: 1350, status: "upcoming" },
      { id: "BK-8802", type: "Chauffeur Ride", vehicle: "Tesla Model 3", date: "June 28, 2026", price: 120, status: "completed" },
      { id: "BK-7703", type: "Tour Package", vehicle: "Hunza Valley Adventure", date: "May 20 - May 27", price: 399, status: "completed" }
    ]);
  }, []);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
    setTicketSubject("");
    setTicketDesc("");
    setTimeout(() => setTicketSent(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Profile Card Header */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl font-display">
              JD
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-900">Jane Doe</h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">Verified Customer &bull; 48 Loyalty Points</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link 
              href="/dashboard/profile"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Edit Profile
            </Link>
            <Link 
              href="/dashboard/settings"
              className="p-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-all"
            >
              <Settings className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Modules */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "bookings", label: "My Bookings", icon: Calendar },
              { id: "wallet", label: "Wallet & Spending", icon: CreditCard },
              { id: "reviews", label: "My Reviews", icon: Star },
              { id: "support", label: "Help & Support", icon: HelpCircle }
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
            
            {/* OVERVIEW PANEL */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                
                {/* Stripe-like widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">${balance}</span>
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center"><ArrowUpRight className="h-3 w-3" /> Available</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Spending</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">${spending}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">MTD</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Loyalty Points</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-blue-600">{rewards}</span>
                      <span className="text-[10px] text-slate-400 font-bold block">Points</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Booking Card */}
                <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-4">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Upcoming Trip</span>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-bold text-xl text-slate-900">Porsche 911 Carrera</h3>
                      <p className="text-xs text-slate-550 mt-1 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> July 12 - July 15 (3 days)
                      </p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKINGS PANEL */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-lg text-slate-800">My Bookings & Rentals</h2>

                <div className="space-y-4">
                  {bookings.map(b => (
                    <div key={b.id} className="bg-white border border-slate-100 p-6 rounded-3xl flex justify-between items-center shadow-sm">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{b.type}</span>
                        <h3 className="font-display font-bold text-md text-slate-850 mt-1">{b.vehicle}</h3>
                        <span className="text-[11px] text-slate-500 mt-1 block">{b.date}</span>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="text-sm font-extrabold text-slate-900">${b.price}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          b.status === "upcoming" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WALLET PANEL */}
            {activeTab === "wallet" && (
              <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-800">Payment Statement</h2>
                  <p className="text-xs text-slate-400 mt-1">Review recent billing transactions and credit balances.</p>
                </div>

                <div className="divide-y divide-slate-50 text-xs">
                  <div className="py-3.5 flex justify-between">
                    <div>
                      <span className="font-bold text-slate-850">Booked Porsche 911 (Card)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Today 12:45 PM &bull; BK-9901</span>
                    </div>
                    <span className="font-bold text-slate-800">-$1350.00</span>
                  </div>

                  <div className="py-3.5 flex justify-between">
                    <div>
                      <span className="font-bold text-slate-850">Wallet Refund (Saiful Muluk)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">June 20, 2026</span>
                    </div>
                    <span className="font-bold text-emerald-600">+$200.00</span>
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-lg text-slate-800">My Reviews</h2>
                
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">Toyota Corolla 2022</span>
                    <div className="flex gap-0.5 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <Star className="h-3.5 w-3.5 fill-slate-200 text-slate-250" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic">"Clean car, smooth pickup. Highly recommended!"</p>
                </div>
              </div>
            )}

            {/* SUPPORT PANEL */}
            {activeTab === "support" && (
              <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-800">Help Desk & Ticketing</h2>
                  <p className="text-xs text-slate-400 mt-1">Submit support tickets to retrieve roadside assistance or claim refunds.</p>
                </div>

                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Subject / Booking ID</label>
                    <input
                      type="text"
                      required
                      placeholder="BK-9901 - Roadside assist query"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Details</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe the issue you encountered..."
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      className="w-full bg-brand-bg border border-slate-200 text-slate-800 rounded-xl p-3 focus:outline-none focus:border-blue-600 text-xs font-semibold"
                    />
                  </div>

                  {ticketSent && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl">
                      Ticket submitted. A Support Representative will contact you shortly.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
