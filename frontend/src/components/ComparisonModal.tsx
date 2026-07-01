"use client";

import { X, Check } from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price_per_day: number;
  transmission: string;
  seats: number;
  fuel_type: string;
}

interface ComparisonModalProps {
  vehicles: Vehicle[];
  onClose: () => void;
  onSelect: (id: string) => void;
}

export default function ComparisonModal({ vehicles, onClose, onSelect }: ComparisonModalProps) {
  return (
    <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c0f17] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h3 className="font-display font-bold text-xl text-white">Compare Vehicles</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Specs Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 text-slate-500 font-semibold uppercase tracking-wider text-xs">Spec</th>
                {vehicles.map((v) => (
                  <th key={v.id} className="text-center py-3 font-display font-bold text-white text-base">
                    {v.make} {v.model}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              <tr>
                <td className="py-3.5 text-slate-400 font-medium">Daily Rate</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="text-center py-3.5 font-bold text-emerald-400">${v.price_per_day}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 text-slate-400 font-medium">Transmission</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="text-center py-3.5 capitalize text-slate-200">{v.transmission}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 text-slate-400 font-medium">Seating Capacity</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="text-center py-3.5 text-slate-200">{v.seats} Seats</td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 text-slate-400 font-medium">Fuel System</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="text-center py-3.5 capitalize text-slate-200">{v.fuel_type || "Petrol"}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 text-slate-400 font-medium">Category Type</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="text-center py-3.5 capitalize text-slate-200">{v.category.replace("_", " ")}</td>
                ))}
              </tr>
              <tr>
                <td className="py-4"></td>
                {vehicles.map((v) => (
                  <td key={v.id} className="text-center py-4">
                    <button
                      onClick={() => onSelect(v.id)}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors"
                    >
                      Book This
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
