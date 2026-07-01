"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Compass, Calendar, ArrowRight, ShieldCheck, Star, MapPin } from "lucide-react";

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  duration_days: number;
  itinerary: string;
  is_active: boolean;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);

  const fallbackTours: Tour[] = [
    {
      id: "hunza-valley",
      title: "Hunza Valley & Attabad Lake Adventure",
      description: "Explore the spectacular Hunza Valley, standard hotels, local tour guides, and luxury transportation.",
      price: 399,
      duration_days: 7,
      itinerary: "Day 1-2: Travel, Day 3: Attabad Lake, Day 4: Karimabad, Day 5-7: Return.",
      is_active: true
    },
    {
      id: "lahore-heritage",
      title: "Lahore Historical & Cultural Day Tour",
      description: "Walled City, Wazir Khan Mosque, Badshahi Mosque, Lahore Fort. Includes traditional breakfast & lunch.",
      price: 45,
      duration_days: 1,
      itinerary: "Morning: Historical Monuments, Evening: Food Street & Wagah Border.",
      is_active: true
    }
  ];

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/tours")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTours(data);
        } else {
          setTours(fallbackTours);
        }
      })
      .catch(() => {
        setTours(fallbackTours);
      });
  }, []);

  const handleBookTour = (tour: Tour) => {
    const userEmail = localStorage.getItem("user_email");
    if (!userEmail) {
      window.dispatchEvent(new CustomEvent("show-auth-guard"));
      return;
    }
    
    // Store simulated pending tour booking
    const tourBooking = {
      id: `BK-TOUR-${Math.floor(1000 + Math.random() * 9000)}`,
      client: userEmail,
      vehicle: `Tour: ${tour.title}`,
      price: tour.price,
      days: tour.duration_days,
      paymentMethod: "Wallet Balance",
      status: "pending",
      timestamp: new Date().toLocaleDateString()
    };

    const existingRaw = localStorage.getItem("pending_bookings");
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push(tourBooking);
    localStorage.setItem("pending_bookings", JSON.stringify(existing));

    alert(`Tourism booking request for "${tour.title}" has been submitted for Admin approval! Check details under your Client workspace.`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-secondary">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600">
            <Compass className="h-6 w-6" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Curated Tourism Packages
          </h1>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed">
            Reserve pre-planned group tours, single-day heritage trips, and customized travel schedules with licensed guides and premium coasters.
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tours.map(t => (
            <div
              key={t.id}
              className="group border border-slate-100 bg-white rounded-3xl p-8 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-[10px] font-bold">
                    <Calendar className="h-3.5 w-3.5" /> {t.duration_days} Days Tour
                  </span>
                  <span className="text-2xl font-black text-slate-900">${t.price}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-slate-850 group-hover:text-blue-600 transition-colors mb-3">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-6">
                  {t.description}
                </p>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 mb-6">
                  <div className="flex gap-1.5 items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                    <span>Itinerary Schedule</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                    {t.itinerary}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-6 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified Agency
                </div>
                
                <button 
                  onClick={() => handleBookTour(t)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Book Tour Now <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
