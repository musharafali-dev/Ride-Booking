"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Car, Bike, Users, Compass, Shield, Zap, HeartHandshake } from "lucide-react";

export default function Home() {
  const categories = [
    {
      name: "City Ride",
      desc: "Fast, instant point-to-point urban rides",
      icon: Zap,
      color: "from-amber-500 to-orange-600",
      link: "/vehicles?category=city_ride"
    },
    {
      name: "Car Rental",
      desc: "Sedans, SUVs, luxury sports cars",
      icon: Car,
      color: "from-blue-500 to-indigo-600",
      link: "/vehicles?category=car_rental"
    },
    {
      name: "Bike Rental",
      desc: "City, touring and adventure bikes",
      icon: Bike,
      color: "from-green-500 to-teal-600",
      link: "/vehicles?category=bike_rental"
    },
    {
      name: "Tour Buses",
      desc: "Buses & coasters for group travel",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      link: "/vehicles?category=bus_coaster"
    }
  ];

  const featuredTours = [
    {
      id: "hunza-valley",
      title: "Hunza Valley & Attabad Lake Adventure",
      desc: "7 Days Group Tour | Hotels, Meals & Transport included",
      price: "$399",
      img: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "lahore-heritage",
      title: "Lahore Historical & Cultural Day Tour",
      desc: "1 Day Private Tour | Guided tour of Royal Fort & Mosque",
      price: "$45",
      img: "https://images.unsplash.com/photo-1588096344356-9b6d80c059c2?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40 border-b border-slate-900 bg-radial from-indigo-950/20 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-400 mb-6">
            <Shield className="h-3.5 w-3.5" /> Secure, Insured & Verified Bookings
          </span>
          <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-tight text-white mb-6">
            Find the Perfect Ride <br />
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              For Any Journey.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10">
            Book city rides, rent self-drive vehicles, bikes, group buses, event coasters, or customize private tourism packages.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/vehicles"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
            >
              Browse Fleet
            </Link>
            <Link
              href="/tours"
              className="px-8 py-4 border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl transition-all"
            >
              Explore Tours
            </Link>
          </div>
        </div>

        {/* Decorative Light effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* Services/Categories Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Explore Our Services
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Choose the type of mobility that fits your exact requirement today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link
                key={i}
                href={c.link}
                className="group relative p-8 rounded-2xl border border-slate-800 bg-[#0c0f17] hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${c.color} flex items-center justify-center text-white mb-6`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold text-xl text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {c.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {c.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-20 border-t border-slate-900 bg-[#04060b]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <h2 className="font-display font-bold text-3xl text-white mb-3">
                Featured Tourism Packages
              </h2>
              <p className="text-slate-400">
                Immerse yourself in spectacular tourism packages with built-in ride solutions.
              </p>
            </div>
            <Link
              href="/tours"
              className="mt-4 md:mt-0 flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors"
            >
              <span>View All Packages</span> <Compass className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredTours.map((t, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0c0f17] transition-all hover:border-slate-700"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={t.img}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#07090e]/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-indigo-400 font-bold text-sm">
                    {t.price}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-6">{t.desc}</p>
                  <Link
                    href={`/tours/${t.id}`}
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-white group-hover:underline"
                  >
                    <span>Learn More</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Built for Modern Travelers
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Experience the standard of reliable corporate, adventure, and daily mobility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-6">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-display font-semibold text-lg text-white mb-3">100% Insured Fleet</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every single vehicle registered on RideSphere is fully verified, audited, and comprehensively insured.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6">
              <HeartHandshake className="h-8 w-8" />
            </div>
            <h3 className="font-display font-semibold text-lg text-white mb-3">24/7 Roadside Assistance</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Got a flat tire or need help on an adventure? Our dedicated support dispatch is ready to assist you any time.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6">
              <Compass className="h-8 w-8" />
            </div>
            <h3 className="font-display font-semibold text-lg text-white mb-3">Flexible Rental Durations</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Rent hourly for quick meetings, daily for family trips, or request monthly enterprise leases.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
