"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Compass, Calendar, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-flex p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
            <Compass className="h-6 w-6" />
          </span>
          <h1 className="font-display font-bold text-4xl text-white mb-4">
            Custom Tourism Packages
          </h1>
          <p className="text-slate-400">
            Book pre-curated tours with professional drivers, tour guides, and premium vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tours.map(t => (
            <div
              key={t.id}
              className="group border border-slate-800 bg-[#0c0f17] rounded-3xl p-8 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg text-xs font-semibold">
                    <Calendar className="h-3.5 w-3.5" /> {t.duration_days} Days
                  </span>
                  <span className="text-2xl font-bold text-white">${t.price}</span>
                </div>

                <h3 className="font-display font-bold text-2xl text-white group-hover:text-indigo-400 transition-colors mb-3">
                  {t.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {t.description}
                </p>
              </div>

              <div className="border-t border-slate-850 pt-6 mt-6 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Itinerary available</span>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors">
                  Book Tour <ArrowRight className="h-3.5 w-3.5" />
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
