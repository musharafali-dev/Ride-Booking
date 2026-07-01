"use client";

import Link from "next/link";
import { Car, Compass, Shield, MapPin, Zap } from "lucide-react";

interface MegaMenuProps {
  onClose: () => void;
}

export default function MegaMenu({ onClose }: MegaMenuProps) {
  const categories = [
    { name: "Economy Car", desc: "Corolla, Civic", icon: Car },
    { name: "SUV & Offroad", desc: "Prado, Fortuner", icon: Compass },
    { name: "Luxury & Sports", desc: "BMW, Porsche 911", icon: Shield },
    { name: "Bikes & Heavy", desc: "Ninja, Gold Wing", icon: Zap },
    { name: "Buses & Group", desc: "Coasters, Universe", icon: MapPin },
  ];

  const destinations = [
    { name: "Hunza Valley", desc: "7 Days Itinerary", link: "/tours" },
    { name: "Skardu Resort Tour", desc: "5 Days Itinerary", link: "/tours" },
    { name: "Lahore Cultural Tour", desc: "1 Day Itinerary", link: "/tours" },
    { name: "Islamabad Express Ride", desc: "City Transfers", link: "/vehicles" },
  ];

  return (
    <div 
      className="absolute top-full left-0 right-0 bg-[#0c0f17] border-b border-slate-800 shadow-2xl z-40 animate-in slide-in-from-top-4 duration-350"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Column: Categories */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Browse Categories</h3>
          <div className="grid grid-cols-1 gap-2">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <Link 
                  key={c.name}
                  href="/vehicles" 
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-900 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-white block">{c.name}</span>
                    <span className="text-xs text-slate-400">{c.desc}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Destinations */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Popular Itineraries</h3>
          <div className="grid grid-cols-1 gap-2">
            {destinations.map((d) => (
              <Link 
                key={d.name}
                href={d.link}
                onClick={onClose}
                className="p-3 rounded-2xl hover:bg-slate-900 transition-colors block group"
              >
                <span className="font-semibold text-sm text-white block group-hover:text-indigo-400 transition-colors">
                  {d.name}
                </span>
                <span className="text-xs text-slate-400">{d.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Banner */}
        <div className="bg-linear-to-br from-indigo-900/30 to-purple-950/20 border border-indigo-500/10 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block mb-2">Summer Promotion</span>
            <h4 className="font-display font-bold text-2xl text-white leading-snug">Explore Northern Pakistan in Comfort</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Book Coasters or SUVs with professional drivers. Get premium insurance & roadside assist included.
            </p>
          </div>
          <Link 
            href="/tours" 
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-indigo-400 transition-colors mt-6"
          >
            Check Out Tours &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
