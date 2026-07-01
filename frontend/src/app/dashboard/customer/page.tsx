"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Wallet, Calendar, CheckCircle, Shield, Clock, 
  MapPin, Star, Bell, Plus, MessageSquare, User, Compass, HelpCircle 
} from "lucide-react";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [walletBalance, setWalletBalance] = useState(500);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Support state
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");

  // Notifications sync log
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setBookings([
      {
        id: "BK-1002",
        type: "rental",
        details: "Toyota Corolla Hybrid",
        date: "July 2, 2026 - July 5, 2026",
        amount: 150,
        status: "active",
        location: "Islamabad Sector F-7 Pick-up"
      },
      {
        id: "BK-3042",
        type: "tour",
        details: "Hunza Valley Adventure",
        date: "July 12, 2026 - July 19, 2026",
        amount: 399,
        status: "pending",
        location: "Faizabad Bus Terminal Depart"
      },
      {
        id: "BK-0911",
        type: "ride",
        details: "City Ride - Honda Civic",
        date: "June 28, 2026",
        amount: 15,
        status: "completed",
        location: "Airport Dropoff"
      }
    ]);

    setTickets([
      { id: "TKT-991", subject: "Refund request for delayed ride", status: "Open", date: "June 29, 2026" }
    ]);

    setNotifications([
      { id: 1, text: "Your self-drive Corolla is verified and ready for pickup at F-7.", type: "system", time: "Just now" },
      { id: 2, text: "Wallet loaded with $100 successfully.", type: "wallet", time: "2 hours ago" }
    ]);
  }, []);

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountToAdd || isNaN(Number(amountToAdd))) return;
    setWalletBalance(prev => prev + Number(amountToAdd));
    setNotifications(prev => [
      { id: Date.now(), text: `Wallet loaded with $${amountToAdd} successfully.`, type: "wallet", time: "Just now" },
      ...prev
    ]);
    setAmountToAdd("");
    setShowAddFunds(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    const newT = {
      id: `TKT-${Math.floor(Math.random() * 900) + 100}`,
      subject: ticketSubject,
      status: "Open",
      date: "Today"
    };
    setTickets(prev => [newT, ...prev]);
    setTicketSubject("");
    setTicketDesc("");
  };

  const handleOpenReview = (booking: any) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setBookings(prev => 
      prev.map(b => b.id === selectedBooking.id ? { ...b, rated: true } : b)
    );
    setShowReviewModal(false);
    setComment("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Profile Card Header */}
        <div className="glass-panel rounded-3xl p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl font-display">
              JD
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">Jane Doe</h1>
              <p className="text-slate-400 text-sm mt-0.5">Verified Customer &bull; 48 Loyalty Points</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-4">
              <Wallet className="h-5 w-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-500 block leading-none mb-1">Balance</span>
                <span className="font-bold text-white text-lg">${walletBalance}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowAddFunds(true)}
              className="p-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector Modules */}
        <div className="flex gap-2 border-b border-slate-850 pb-4 mb-8 overflow-x-auto">
          {["bookings", "wallet", "support", "profile"].map((tab) => (
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

        {/* Dynamic Workspace Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-400" /> Active Journeys
                </h2>

                <div className="space-y-4">
                  {bookings.filter(b => b.status !== "completed").map(b => (
                    <div key={b.id} className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors">
                      <div className="absolute top-0 right-0 h-full w-1 bg-indigo-500"></div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-xs text-indigo-400 font-mono tracking-wider">{b.id}</span>
                          <h3 className="font-display font-bold text-xl text-white mt-1 capitalize">{b.details}</h3>
                          
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            <span>{b.date}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-500" />
                            <span>{b.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-slate-800/80 pt-4 sm:pt-0">
                          <div className="text-right">
                            <span className="text-xl font-bold text-white">${b.amount}</span>
                            <span className="text-xs text-slate-500 block capitalize">{b.type}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize border ${
                            b.status === "active" 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2 pt-4">
                  <CheckCircle className="h-5 w-5 text-indigo-400" /> Past Bookings
                </h2>

                <div className="space-y-4">
                  {bookings.filter(b => b.status === "completed").map(b => (
                    <div key={b.id} className="bg-[#0c0f17] border border-slate-850 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-white capitalize">{b.details}</h3>
                        <p className="text-xs text-slate-500 mt-1">{b.date} &bull; {b.location}</p>
                      </div>

                      <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between">
                        <span className="text-lg font-bold text-white">${b.amount}</span>
                        {b.rated ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                            <Star className="h-3.5 w-3.5 fill-current" /> Reviewed
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleOpenReview(b)}
                            className="px-3.5 py-2 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 rounded-lg text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5"
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> Rate Trip
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WALLET TAB */}
            {activeTab === "wallet" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white">Wallet Statements</h2>
                <div className="bg-[#0c0f17] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-850 pb-3">
                    <span>Loaded funds via JazzCash</span>
                    <span className="font-bold text-emerald-400">+$100.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-850 pb-3">
                    <span>Booking payment BK-1002 (Toyota Corolla)</span>
                    <span className="font-bold text-rose-400">-$150.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Initial Account Signup Credit</span>
                    <span className="font-bold text-emerald-400">+$500.00</span>
                  </div>
                </div>
              </div>
            )}

            {/* SUPPORT TAB */}
            {activeTab === "support" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-indigo-400" /> Help & Support Desk
                </h2>
                
                <form onSubmit={handleCreateTicket} className="bg-[#0c0f17] border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Delayed refund or dispute listing"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Complaint details</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Please details what happened..."
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors"
                  >
                    Submit Support Ticket
                  </button>
                </form>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-400">Your Tickets</h3>
                  {tickets.map(t => (
                    <div key={t.id} className="bg-[#0c0f17] border border-slate-850 p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-500">{t.id} &bull; {t.date}</span>
                        <h4 className="font-semibold text-xs text-white mt-1">{t.subject}</h4>
                      </div>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-semibold">{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-white">Profile Settings</h2>
                <div className="bg-[#0c0f17] border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Full Name</span>
                      <span className="font-semibold text-white">Jane Doe</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Email Address</span>
                      <span className="font-semibold text-white">customer@ridesphere.com</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Verified Status</span>
                      <span className="font-semibold text-emerald-400">KYC Verified</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Default City</span>
                      <span className="font-semibold text-white">Islamabad, PK</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Real-time sync notifications */}
          <div className="space-y-8">
            <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8">
              <h3 className="font-display font-bold text-lg text-white mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-400" /> Activity Alerts
              </h3>
              <div className="space-y-4">
                {notifications.map(n => (
                  <div key={n.id} className="text-xs text-slate-400 border-b border-slate-850 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-indigo-400 font-semibold uppercase text-[9px] tracking-wider">{n.type}</span>
                      <span className="text-[9px] text-slate-650">{n.time}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-linear-to-br from-indigo-900/40 to-indigo-950/20 border border-indigo-500/20 rounded-3xl p-8 text-center">
              <Shield className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-white mb-2">Safe RideSphere Protection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full accidental liability insurance and 24/7 helpline coverage for all city dispatches and vehicle checkouts.
              </p>
            </div>
          </div>

        </div>

        {/* Modal: Add Funds */}
        {showAddFunds && (
          <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
              <h3 className="font-display font-bold text-xl text-white mb-6">Load Wallet Funds</h3>
              <form onSubmit={handleAddFunds} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Amount ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 100"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddFunds(false)}
                    className="flex-1 py-3 border border-slate-800 hover:bg-slate-800 text-slate-400 font-semibold rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    Add Funds
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Leave Review */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
              <h3 className="font-display font-bold text-xl text-white mb-2">Rate Your Experience</h3>
              <p className="text-sm text-slate-400 mb-6">How was your trip with {selectedBooking?.details}?</p>
              
              <form onSubmit={submitReview} className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`h-8 w-8 ${star <= rating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Comment</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what you liked or how we can improve..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-3 border border-slate-800 hover:bg-slate-800 text-slate-400 font-semibold rounded-xl text-sm transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    Submit Review
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
