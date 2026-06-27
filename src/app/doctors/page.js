// "use client";
// import { useState, useEffect, useMemo } from "react";
// import {
//   Search,
//   ChevronDown,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import DoctorCard from "@/components/DoctorCard";

// const SPECIALIZATIONS = [
//   "Cardiology",
//   "Neurology",
//   "Orthopedics",
//   "Pediatrics",
//   "Dermatology",
//   "General Medicine",
// ];

// export default function FindDoctors() {
//   const [search, setSearch] = useState("");
//   const [specialization, setSpecialization] = useState("");
//   const [sortBy, setSortBy] = useState("rating");
//   const [page, setPage] = useState(1);
//   const [doctors, setDoctors] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const limit = 9;

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const params = new URLSearchParams(window.location.search);
//       const s = params.get("search");
//       const sp = params.get("specialization");
//       if (s) setSearch(s);
//       if (sp) setSpecialization(sp);
//     }
//   }, []);

//   const fetchDoctors = () => {
//     setLoading(true);
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/doctors?page=${page}&limit=${limit}`;
//     if (search) url += `&search=${encodeURIComponent(search)}`;
//     if (specialization) url += `&specialization=${encodeURIComponent(specialization)}`;
//     if (sortBy) url += `&sortBy=${encodeURIComponent(sortBy)}`;

//     fetch(url)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.doctors) {
//           setDoctors(data.doctors);
//           setTotal(data.total);
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchDoctors();
//   }, [search, specialization, sortBy, page]);

//   useEffect(() => {
//     setPage(1);
//   }, [search, specialization, sortBy]);

//   const totalPages = Math.max(1, Math.ceil(total / limit));

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="border-b border-gray-200 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//           <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
//             <div>
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                 Browse care providers
//               </p>
//               <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
//                 Find your doctor
//               </h1>
//               <p className="mt-2 text-sm text-gray-500 max-w-xl">
//                 Search across our verified specialists by name, specialization,
//                 or hospital.
//               </p>
//             </div>
//             <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-700 self-start md:self-auto">
//               <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
//               {loading ? "…" : `${total} doctors available`}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Filters */}
//         <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_180px] gap-3">
//             <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
//               <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by name or specialization…"
//                 className="flex-1 bg-transparent text-sm outline-none"
//               />
//               {search && (
//                 <button
//                   onClick={() => setSearch("")}
//                   className="p-1 text-gray-400 hover:text-gray-700"
//                 >
//                   <X className="w-3.5 h-3.5" />
//                 </button>
//               )}
//             </div>

//             <div className="relative">
//               <select
//                 value={specialization}
//                 onChange={(e) => setSpecialization(e.target.value)}
//                 className="appearance-none w-full bg-white border border-gray-200 rounded-lg pl-3 pr-9 py-2 text-sm text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
//               >
//                 <option value="">All Specializations</option>
//                 {SPECIALIZATIONS.map((s) => (
//                   <option key={s} value={s}>
//                     {s}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//             </div>

//             <div className="relative">
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="appearance-none w-full bg-white border border-gray-200 rounded-lg pl-3 pr-9 py-2 text-sm text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
//               >
//                 <option value="rating">Sort: Highest rating</option>
//                 <option value="fee_asc">Sort: Fee (low to high)</option>
//                 <option value="fee_desc">Sort: Fee (high to low)</option>
//                 <option value="experience">Sort: Most experienced</option>
//               </select>
//               <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//             </div>
//           </div>

//           {(search || specialization) && (
//             <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
//               <span className="text-xs text-gray-500">Active:</span>
//               {search && (
//                 <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700">
//                   Search: {search}
//                   <button
//                     onClick={() => setSearch("")}
//                     className="text-gray-400 hover:text-gray-700"
//                   >
//                     <X className="w-3.5 h-3.5" />
//                   </button>
//                 </span>
//               )}
//               {specialization && (
//                 <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700">
//                   {specialization}
//                   <button
//                     onClick={() => setSpecialization("")}
//                     className="text-gray-400 hover:text-gray-700"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Doctors grid */}
//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white border border-gray-200 rounded-xl p-5 h-44 animate-pulse"
//               />
//             ))}
//           </div>
//         ) : doctors.length ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {doctors.map((d) => (
//               <DoctorCard key={d._id} doctor={d} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
//             <p className="text-base font-semibold text-gray-900">
//               No doctors found
//             </p>
//             <p className="text-sm text-gray-500 mt-1">
//               Try a different search or specialization.
//             </p>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
//             <p className="text-xs text-gray-500">
//               Page {page} of {totalPages} · {total} doctors
//             </p>
//             <div className="flex items-center gap-1">
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft className="w-3.5 h-3.5" />
//                 Previous
//               </button>
//               {Array.from({ length: totalPages }).map((_, i) => {
//                 const p = i + 1;
//                 return (
//                   <button
//                     key={p}
//                     onClick={() => setPage(p)}
//                     className={`min-w-[36px] h-8 rounded-lg text-sm transition-colors ${
//                       p === page
//                         ? "bg-blue-600 text-white"
//                         : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 );
//               })}
//               <button
//                 disabled={page === totalPages}
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 Next
//                 <ChevronRight className="w-3.5 h-3.5" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }







"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Search,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Sparkles,
  Users,
  Star,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import { motion, AnimatePresence } from "framer-motion";

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General Medicine",
  "Ophthalmology",
  "ENT",
  "Gynecology",
  "Psychiatry",
];

export default function FindDoctors() {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const limit = 9;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("search");
      const sp = params.get("specialization");
      if (s) setSearch(s);
      if (sp) setSpecialization(sp);
    }
  }, []);

  const fetchDoctors = () => {
    setLoading(true);
    let url = `${process.env.NEXT_PUBLIC_API_URL}/doctors?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (specialization) url += `&specialization=${encodeURIComponent(specialization)}`;
    if (sortBy) url += `&sortBy=${encodeURIComponent(sortBy)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.doctors) {
          setDoctors(data.doctors);
          setTotal(data.total);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, [search, specialization, sortBy, page]);

  useEffect(() => {
    setPage(1);
  }, [search, specialization, sortBy]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-slate-50";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const bgCardHover = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50";
  const bgInput = theme === "dark" ? "bg-slate-800" : "bg-slate-50";
  const borderColor = theme === "dark" ? "border-slate-800" : "border-slate-200";
  const borderLight = theme === "dark" ? "border-slate-700" : "border-slate-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-slate-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-slate-400";
  const placeholderColor = theme === "dark" ? "placeholder-slate-500" : "placeholder-slate-400";
  const bgHero = theme === "dark" ? "bg-slate-900" : "bg-white";
  const bgBadge = theme === "dark" ? "bg-slate-800" : "bg-slate-50";
  const bgFilter = theme === "dark" ? "bg-slate-800/50" : "bg-white/95";
  const bgActiveFilter = theme === "dark" ? "bg-slate-800" : "bg-white";

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${bgMain} transition-colors duration-300`}>
      {/* ===== HERO HEADER ===== */}
      <section className={`${bgHero} border-b ${borderColor} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className={`inline-flex items-center gap-2 ${theme === "dark" ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-700"} rounded-full px-3 py-1 text-xs font-medium mb-3 transition-colors duration-300`}>
                <Sparkles className="w-3 h-3" />
                Find Your Doctor
              </div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary} transition-colors duration-300`}>
                Browse <span className="text-blue-600 dark:text-blue-400">Specialists</span>
              </h1>
              <p className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}>
                {total} verified doctors available
              </p>
            </div>

            {/* Quick Stats */}
            <div className={`flex items-center gap-4 ${bgBadge} rounded-xl px-4 py-2 border ${borderColor} transition-colors duration-300`}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className={`text-sm font-medium ${textPrimary}`}>{total}</span>
              </div>
              <div className={`w-px h-6 ${borderColor}`} />
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className={`text-sm font-medium ${textPrimary}`}>4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILTERS ===== */}
      <div className={`sticky top-0 z-30 ${bgFilter} backdrop-blur-sm border-b ${borderColor} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search - Full Width */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors, specialties..."
                className={`w-full pl-9 pr-9 py-2 ${bgInput} border ${borderColor} rounded-lg text-sm ${textPrimary} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300`}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 ${textMuted} hover:${textPrimary} transition-colors`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters - Row */}
            <div className="flex gap-2">
              <div className="relative min-w-[140px]">
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className={`appearance-none w-full ${bgInput} border ${borderColor} rounded-lg pl-3 pr-8 py-2 text-sm ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all duration-300`}
                >
                  <option value="">All Specialties</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className={`w-4 h-4 ${textMuted} absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none`} />
              </div>

              <div className="relative min-w-[130px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`appearance-none w-full ${bgInput} border ${borderColor} rounded-lg pl-3 pr-8 py-2 text-sm ${textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all duration-300`}
                >
                  <option value="rating">⭐ Rating</option>
                  <option value="fee_asc">💰 Low Fee</option>
                  <option value="fee_desc">💰 High Fee</option>
                  <option value="experience">🏆 Experience</option>
                </select>
                <ChevronDown className={`w-4 h-4 ${textMuted} absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none`} />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {(search || specialization) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50"
              >
                <span className={`text-xs ${textMuted}`}>Filters:</span>
                {search && (
                  <span className={`inline-flex items-center gap-1 ${theme === "dark" ? "bg-slate-800 text-blue-400 border-slate-700" : "bg-blue-50 text-blue-700 border-blue-200"} border rounded-full px-2.5 py-0.5 text-xs transition-colors duration-300`}>
                    {search}
                    <button onClick={() => setSearch("")} className="hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {specialization && (
                  <span className={`inline-flex items-center gap-1 ${theme === "dark" ? "bg-slate-800 text-purple-400 border-slate-700" : "bg-purple-50 text-purple-700 border-purple-200"} border rounded-full px-2.5 py-0.5 text-xs transition-colors duration-300`}>
                    {specialization}
                    <button onClick={() => setSpecialization("")} className="hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => { setSearch(""); setSpecialization(""); }}
                  className={`text-xs ${textMuted} hover:${textPrimary} transition-colors`}
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===== DOCTORS GRID ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${bgCard} rounded-xl p-4 h-48 animate-pulse border ${borderColor} transition-colors duration-300`} />
            ))}
          </div>
        ) : doctors.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((d, i) => (
              <DoctorCard key={d._id} doctor={d} index={i} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 ${bgCard} rounded-xl border ${borderColor} transition-colors duration-300`}>
            <div className={`w-16 h-16 mx-auto ${bgInput} rounded-full flex items-center justify-center mb-3 transition-colors duration-300`}>
              <Search className={`w-8 h-8 ${textMuted}`} />
            </div>
            <h3 className={`text-lg font-semibold ${textPrimary}`}>No doctors found</h3>
            <p className={`text-sm ${textSecondary} mt-1`}>Try adjusting your filters</p>
          </div>
        )}

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t ${borderColor} transition-colors duration-300`}>
            <span className={`text-sm ${textSecondary}`}>
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={`px-3 py-1.5 rounded-lg border ${borderColor} text-sm ${textSecondary} ${bgCardHover} disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                let p;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                if (p < 1 || p > totalPages) return null;

                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                      p === page
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : `${bgCard} border ${borderColor} ${textSecondary} ${bgCardHover}`
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className={`px-3 py-1.5 rounded-lg border ${borderColor} text-sm ${textSecondary} ${bgCardHover} disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}