"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Car, Compass, Layout, Shield } from "lucide-react";

interface CommandPaletteProps {
  onClose: () => void;
}

export default function CommandPalette({ onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const items = [
    { name: "Toyota Corolla (Economy Rental)", category: "Vehicles", link: "/vehicles" },
    { name: "Porsche 911 Carrera (Sports)", category: "Vehicles", link: "/vehicles" },
    { name: "Hunza Valley Explorer Tour", category: "Tours", link: "/tours" },
    { name: "Customer Dashboard Workspace", category: "Dashboard", link: "/dashboard/customer" },
    { name: "Fleet Owner Administration", category: "Dashboard", link: "/dashboard/owner" },
    { name: "Driver Acceptance Dispatch Panel", category: "Dashboard", link: "/dashboard/driver" }
  ];

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = (link: string) => {
    router.push(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] p-4">
      <div className="bg-[#0c0f17] border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Input Bar */}
        <div className="relative border-b border-slate-800 p-4">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or vehicle search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent pl-12 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none text-sm"
          />
        </div>

        {/* Results List */}
        <div className="max-h-60 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-4 text-xs text-slate-500 text-center">No matching commands or listings.</div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.link)}
                className="w-full text-left p-3 hover:bg-slate-900 rounded-xl flex items-center justify-between text-xs transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {item.category === "Vehicles" && <Car className="h-4 w-4 text-indigo-400" />}
                  {item.category === "Tours" && <Compass className="h-4 w-4 text-indigo-400" />}
                  {item.category === "Dashboard" && <Layout className="h-4 w-4 text-indigo-400" />}
                  <span className="text-slate-200 group-hover:text-white font-medium">{item.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 capitalize bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="border-t border-slate-800 p-3 bg-slate-950 flex justify-between text-[10px] text-slate-500">
          <span>Press <kbd className="bg-slate-900 px-1 py-0.5 rounded border border-slate-800">ESC</kbd> to exit</span>
          <span>Use keyboard to navigate</span>
        </div>

      </div>
    </div>
  );
}
