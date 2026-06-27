"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Stethoscope,
  Eye,
  Pill,
  Search,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Award,
  Users,
  Quote,
} from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import { authClient } from "@/lib/auth-client";

const SPECIALIZATIONS = [
  { icon: Heart, label: "Cardiology", color: "text-red-500" },
  { icon: Brain, label: "Neurology", color: "text-purple-500" },
  { icon: Bone, label: "Orthopedics", color: "text-orange-500" },
  { icon: Baby, label: "Pediatrics", color: "text-pink-500" },
  { icon: Stethoscope, label: "General Medicine", color: "text-blue-500" },
  { icon: Eye, label: "Ophthalmology", color: "text-cyan-500" },
];

export default function Home() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    doctors: 150,
    patients: 10000,
    appointments: 2500,
    reviews: 800,
  });
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [testimonials, setTestimonials] = useState([
    {
      _id: "t1",
      reviewText:
        "Dr. Jenkins was extremely professional and explained everything in clear detail. Her diagnosis was spot on.",
      patientName: "John Doe",
      doctorName: "Dr. Sarah Jenkins (Cardiology)",
      rating: 5,
    },
    {
      _id: "t2",
      reviewText:
        "Excellent neurological consultation. Highly knowledgeable and caring specialist.",
      patientName: "Alice Smith",
      doctorName: "Dr. Michael Chang (Neurology)",
      rating: 5,
    },
    {
      _id: "t3",
      reviewText:
        "Great experience at the pediatric clinic. Very friendly staff and child-friendly environment.",
      patientName: "Robert Johnson",
      doctorName: "Dr. Emily Rodriguez (Pediatrics)",
      rating: 5,
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Fetch statistics
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setStats(data);
      })
      .catch(console.error);

    // Fetch featured/top-rated doctors
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?sortBy=rating&limit=3`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.doctors) setFeaturedDoctors(data.doctors);
      })
      .catch(console.error);

    // Fetch testimonials
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?limit=3`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setTestimonials(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 rounded-full px-3 py-1.5 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Now accepting new patients
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.05]">
                Healthcare,
                <br />
                <span className="text-blue-600">reimagined</span> for everyone.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl">
                Book appointments with verified specialists, manage your medical
                records, and pay securely — all in one quiet, trustworthy place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/doctors"
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors"
                >
                  Find a Doctor <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium px-5 py-3 rounded-lg transition-colors"
                >
                  How it works
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                {[
                  ["Verified", "specialists"],
                  ["24/7", "support"],
                  ["Secure", "& private"],
                ].map(([k, v]) => (
                  <div key={k} className="border-l border-gray-200 pl-3">
                    <p className="text-xs font-semibold text-gray-900">{k}</p>
                    <p className="text-xs text-gray-500">{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Quick Search
                    </p>
                    <h3 className="text-base font-semibold text-gray-900 mt-0.5">
                      Find a specialist
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Live
                  </span>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = new FormData(e.target).get("q");
                    window.location.href = `/doctors?search=${encodeURIComponent(q || "")}`;
                  }}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    name="q"
                    placeholder="Search by name or specialization…"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Search
                  </button>
                </form>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {SPECIALIZATIONS.slice(0, 6).map(
                    ({ icon: Icon, label, color }) => (
                      <a
                        key={label}
                        href={`/doctors?specialization=${encodeURIComponent(label)}`}
                        className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors text-center"
                      >
                        <Icon className={`w-4 h-4 mx-auto ${color}`} />
                        <p className="text-[11px] text-gray-700 mt-1.5 truncate">
                          {label}
                        </p>
                      </a>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Verified Doctors", stats.doctors ?? 150],
              ["Patients Served", stats.patients ?? 10000],
              ["Appointments Booked", stats.appointments ?? 2500],
              ["Patient Reviews", stats.reviews ?? 800],
            ].map(([label, value], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                  {typeof value === "number" ? value.toLocaleString() : value}
                  {typeof value === "number" &&
                    value > 0 &&
                    label !== "Patient Reviews" &&
                    "+"}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[10px] text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Growing
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALIZATIONS */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 mb-3">
                Browse care areas
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                Medical specializations
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Curated care across the most common practice areas.
              </p>
            </div>
            <a
              href="/doctors"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SPECIALIZATIONS.map(({ icon: Icon, label, color }) => (
              <a
                key={label}
                href={`/doctors?specialization=${encodeURIComponent(label)}`}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors text-center"
              >
                <div className="w-11 h-11 mx-auto rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">View doctors</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-xs font-medium mb-3">
                Top rated
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                Featured doctors
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Specialists patients consistently rate the highest.
              </p>
            </div>
            <a
              href="/doctors"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              See all doctors <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredDoctors.map((d) => (
              <DoctorCard key={d._id} doctor={d} />
            ))}
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-5 h-44 animate-pulse"
                />
              ))}
            {!loading && featuredDoctors.length === 0 && (
              <p className="text-center col-span-3 text-gray-500 italic py-8">
                No doctors found yet. Please seed or register doctors.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 mb-3">
                Why us
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                A calmer way to manage your health.
              </h2>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                We obsessed over the small things — verification, security, fair
                pricing — so the care that follows feels effortless.
              </p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Shield,
                  title: "Verified by Admin",
                  desc: "Every doctor goes through a human verification step before going public.",
                },
                {
                  icon: Clock,
                  title: "Real-time slots",
                  desc: "See live availability without phone-tag or paperwork.",
                },
                {
                  icon: Award,
                  title: "Honest ratings",
                  desc: "Reviews are tied to confirmed appointments — no fake noise.",
                },
                {
                  icon: Users,
                  title: "Care continuity",
                  desc: "Your prescriptions, history, and follow-ups all live together.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 mb-3">
              Patient stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              From people we've cared for
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Real reviews from real appointments on MediCare Connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
              >
                <Quote className="w-5 h-5 text-gray-300" />
                <p className="text-sm text-gray-700 mt-3 leading-relaxed line-clamp-4">
                  "{t.reviewText}"
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">
                      {(t.patientName || "P")[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        {t.patientName || "Patient"}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {t.doctorName}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3 h-3 ${
                          idx < t.rating
                            ? "text-orange-500 fill-orange-500"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            {testimonials.length === 0 && !loading && (
              <div className="md:col-span-3 text-center py-12 bg-white border border-gray-200 rounded-xl">
                <p className="text-sm text-gray-500">
                  Reviews from your patients will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gray-900 rounded-2xl p-10 sm:p-14 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white rounded-full px-3 py-1 text-xs font-medium mb-4">
                <Pill className="w-3 h-3" />
                Ready when you are
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Your next appointment is a few clicks away.
              </h2>
              <p className="text-sm text-gray-400 mt-3 max-w-lg">
                Sign up free, browse verified specialists, and book a time that
                actually fits your day.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {mounted && user ? (
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Go to Dashboard
                  </a>
                ) : (
                  <a
                    href="/register"
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Create account
                  </a>
                )}
                <a
                  href="/doctors"
                  className="inline-flex items-center gap-1.5 bg-transparent border border-white/30 hover:bg-white/10 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Browse doctors <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 80% 50%, rgba(37,99,235,0.4) 0%, transparent 50%)",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
