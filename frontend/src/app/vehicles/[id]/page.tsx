"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Shield, CreditCard, Wallet, Landmark, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Vehicle {
  id: string;
  category: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  price_per_day: number;
  price_per_hour: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  image_url: string;
  is_available: boolean;
}

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const vehicleId = resolvedParams.id;
  const router = useRouter();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [days, setDays] = useState(3);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fallbackVehicles: Vehicle[] = [
    {
      id: "v1",
      category: "car_rental",
      make: "Toyota",
      model: "Corolla Hybrid",
      year: 2022,
      color: "Silver",
      license_plate: "LEC-5566",
      price_per_day: 50,
      price_per_hour: 8,
      seats: 5,
      transmission: "automatic",
      fuel_type: "hybrid",
      image_url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
      is_available: true
    },
    {
      id: "v2",
      category: "luxury",
      make: "Mercedes-Benz",
      model: "S-Class Prestige",
      year: 2023,
      color: "Black",
      license_plate: "VIP-777",
      price_per_day: 250,
      price_per_hour: 35,
      seats: 5,
      transmission: "automatic",
      fuel_type: "petrol",
      image_url: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
      is_available: true
    },
    {
      id: "v3",
      category: "bike_rental",
      make: "Honda",
      model: "CB500X Tourer",
      year: 2021,
      color: "Red",
      license_plate: "BIKE-9922",
      price_per_day: 35,
      price_per_hour: 5,
      seats: 2,
      transmission: "manual",
      fuel_type: "petrol",
      image_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
      is_available: true
    },
    {
      id: "v4",
      category: "bus_coaster",
      make: "Toyota",
      model: "Coaster Deluxe",
      year: 2020,
      color: "White",
      license_plate: "BUS-8800",
      price_per_day: 150,
      price_per_hour: 25,
      seats: 29,
      transmission: "manual",
      fuel_type: "diesel",
      image_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
      is_available: true
    }
  ];

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/vehicles/${vehicleId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setVehicle(data);
        } else {
          const found = fallbackVehicles.find(v => v.id === vehicleId);
          setVehicle(found || fallbackVehicles[0]);
        }
      })
      .catch(() => {
        const found = fallbackVehicles.find(v => v.id === vehicleId);
        setVehicle(found || fallbackVehicles[0]);
      });
  }, [vehicleId]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="text-slate-400">Loading details...</div>
      </div>
    );
  }

  const totalCost = vehicle.price_per_day * days;

  const handleBooking = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    // Simulate dates
    const start_time = new Date().toISOString();
    const end_time = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    try {
      // Mock booking & payment call
      // In full production, this integrates with /api/v1/bookings and /api/v1/payments
      setSuccess(true);
    } catch (err) {
      setErrorMsg("Payment failed or server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/vehicles" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        {success ? (
          <div className="max-w-xl mx-auto text-center py-16 bg-[#0c0f17] border border-slate-800 rounded-3xl p-8">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-2">Booking Confirmed!</h2>
            <p className="text-slate-400 mb-8">
              Your rental of the <strong>{vehicle.make} {vehicle.model}</strong> has been secured for {days} days.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Details Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-3xl overflow-hidden border border-slate-800">
                <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-96 object-cover" />
              </div>

              <div>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-white">
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-slate-400 capitalize mt-2">{vehicle.category.replace("_", " ")} &bull; {vehicle.year}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-slate-800/80 py-6">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Seats</span>
                  <span className="font-semibold text-white">{vehicle.seats} Seats</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Transmission</span>
                  <span className="font-semibold text-white capitalize">{vehicle.transmission}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Fuel Type</span>
                  <span className="font-semibold text-white capitalize">{vehicle.fuel_type}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Daily Price</span>
                  <span className="font-semibold text-white">${vehicle.price_per_day}/day</span>
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-white mb-3">Rental Conditions</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">✓ Valid Driving License required upon pickup</li>
                  <li className="flex items-center gap-2">✓ Refundable security deposit of $150</li>
                  <li className="flex items-center gap-2">✓ 250 free kilometers per day</li>
                </ul>
              </div>
            </div>

            {/* Cost Calculator / Checkout Card */}
            <div>
              <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl p-8 sticky top-24">
                <h3 className="font-display font-bold text-xl text-white mb-6">Booking Details</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentMethod("wallet")}
                        className={`flex items-center justify-center gap-1.5 p-3 rounded-lg border text-xs font-semibold transition-all ${
                          paymentMethod === "wallet"
                            ? "border-indigo-500 bg-indigo-500/10 text-white"
                            : "border-slate-800 bg-slate-900/50 text-slate-400"
                        }`}
                      >
                        <Wallet className="h-4 w-4" /> Wallet
                      </button>
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`flex items-center justify-center gap-1.5 p-3 rounded-lg border text-xs font-semibold transition-all ${
                          paymentMethod === "card"
                            ? "border-indigo-500 bg-indigo-500/10 text-white"
                            : "border-slate-800 bg-slate-900/50 text-slate-400"
                        }`}
                      >
                        <CreditCard className="h-4 w-4" /> Card
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-850 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Daily Rate</span>
                    <span>${vehicle.price_per_day}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Days</span>
                    <span>{days}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-850">
                    <span>Total Amount</span>
                    <span>${totalCost}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/10 transition-colors"
                >
                  {isSubmitting ? "Processing..." : "Confirm & Pay"}
                </button>

                <p className="text-[10px] text-center text-slate-500 mt-4 leading-relaxed">
                  By clicking Confirm & Pay, you agree to our Rental Agreement and Policies.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
