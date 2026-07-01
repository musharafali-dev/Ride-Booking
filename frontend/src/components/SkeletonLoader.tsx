"use client";

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border border-slate-800 bg-[#0c0f17]/50 rounded-2xl h-72 overflow-hidden flex flex-col p-6 space-y-4">
          <div className="h-40 bg-slate-900 rounded-xl w-full"></div>
          <div className="h-4 bg-slate-900 rounded w-1/3"></div>
          <div className="h-3 bg-slate-900 rounded w-2/3"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-slate-900 rounded w-1/4"></div>
            <div className="h-8 bg-slate-900 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
