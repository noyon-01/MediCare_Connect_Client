"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DoctorCard from "@/components/DoctorCard";

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General Medicine",
];

export default function FindDoctors() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 9;

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Browse care providers
              </p>
              <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                Find your doctor
              </h1>
              <p className="mt-2 text-sm text-gray-500 max-w-xl">
                Search across our verified specialists by name, specialization,
                or hospital.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-700 self-start md:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {loading ? "…" : `${total} doctors available`}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_180px] gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or specialization…"
                className="flex-1 bg-transparent text-sm outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-200 rounded-lg pl-3 pr-9 py-2 text-sm text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <option value="">All Specializations</option>
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-200 rounded-lg pl-3 pr-9 py-2 text-sm text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <option value="rating">Sort: Highest rating</option>
                <option value="fee_asc">Sort: Fee (low to high)</option>
                <option value="fee_desc">Sort: Fee (high to low)</option>
                <option value="experience">Sort: Most experienced</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {(search || specialization) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">Active:</span>
              {search && (
                <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700">
                  Search: {search}
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {specialization && (
                <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700">
                  {specialization}
                  <button
                    onClick={() => setSpecialization("")}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Doctors grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5 h-44 animate-pulse"
              />
            ))}
          </div>
        ) : doctors.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((d) => (
              <DoctorCard key={d._id} doctor={d} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
            <p className="text-base font-semibold text-gray-900">
              No doctors found
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Try a different search or specialization.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages} · {total} doctors
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[36px] h-8 rounded-lg text-sm transition-colors ${
                      p === page
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
