"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
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
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Activity,
  ChevronRight,
  Calendar,
  MessageCircle,
  Video,
  CheckCircle,
} from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import { authClient } from "@/lib/auth-client";

const SPECIALIZATIONS = [
  {
    icon: Heart,
    label: "Cardiology",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    icon: Brain,
    label: "Neurology",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    icon: Bone,
    label: "Orthopedics",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: Baby,
    label: "Pediatrics",
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-950/30",
  },
  {
    icon: Stethoscope,
    label: "General Medicine",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Eye,
    label: "Ophthalmology",
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
  },
];

export default function Home() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const { theme, setTheme } = useTheme();

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

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  useEffect(() => {
    setMounted(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setStats(data);
      })
      .catch(console.error);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?sortBy=rating&limit=3`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.doctors) setFeaturedDoctors(data.doctors);
      })
      .catch(console.error);

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

  // Hero background based on theme
  const heroBg =
    theme === "dark"
      ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900";

  // Section backgrounds
  const sectionBg = theme === "dark" ? "bg-slate-950" : "bg-white";
  const sectionAltBg = theme === "dark" ? "bg-slate-900" : "bg-slate-50";
  const cardBg = theme === "dark" ? "bg-slate-900/50" : "bg-white";
  const cardAltBg = theme === "dark" ? "bg-slate-800/50" : "bg-slate-50";
  const borderColor =
    theme === "dark" ? "border-slate-800" : "border-slate-200";
  const textColor = theme === "dark" ? "text-slate-300" : "text-slate-500";
  const headingColor = theme === "dark" ? "text-white" : "text-slate-900";

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${sectionBg} transition-colors duration-300`}>
      {/* ===== HERO SECTION ===== */}
      <motion.section
        style={{ opacity: heroOpacity }}
        className={`relative min-h-[90vh] flex items-center overflow-hidden ${heroBg}`}
      >
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-rose-500/5 to-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-white/80">
                  Now accepting new patients
                </span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05]"
              >
                Your Health,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400">
                  Our Purpose
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/70 leading-relaxed max-w-lg"
              >
                Experience compassionate care from verified specialists. Book
                appointments, manage records, and connect with your doctor — all
                in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <a
                  href="/doctors"
                  className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-900 font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  Find a Doctor
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium px-7 py-3.5 rounded-full transition-all duration-300"
                >
                  <Video className="w-4 h-4" />
                  Virtual Consult
                </a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-8 pt-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[
                      "https://i.pravatar.cc/32?img=1",
                      "https://i.pravatar.cc/32?img=2",
                      "https://i.pravatar.cc/32?img=3",
                      "https://i.pravatar.cc/32?img=4",
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-white/20"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      10K+ Patients
                    </p>
                    <p className="text-xs text-white/50">Trusted healthcare</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/50">4.9/5</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-white/50 font-medium uppercase tracking-wider">
                      Quick Access
                    </p>
                    <h3 className="text-lg font-semibold text-white mt-0.5">
                      What would you like to do?
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/20 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-medium">
                      Live
                    </span>
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = new FormData(e.target).get("q");
                    window.location.href = `/doctors?search=${encodeURIComponent(q || "")}`;
                  }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-white/30 transition-colors"
                >
                  <Search className="w-4 h-4 text-white/40" />
                  <input
                    name="q"
                    placeholder="Search doctors, specialties..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
                  />
                  <button
                    type="submit"
                    className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
                  >
                    Search
                  </button>
                </form>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {SPECIALIZATIONS.slice(0, 6).map(
                    ({ icon: Icon, label, color, bg }) => (
                      <motion.a
                        key={label}
                        href={`/doctors?specialization=${encodeURIComponent(label)}`}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-center transition-all duration-300"
                      >
                        <div
                          className={`w-8 h-8 mx-auto rounded-full ${bg} flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <p className="text-[10px] text-white/70 truncate group-hover:text-white transition-colors">
                          {label}
                        </p>
                      </motion.a>
                    ),
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <a
                    href="/doctors"
                    className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
                  >
                    View all specialties
                    <ChevronRight className="w-3 h-3" />
                  </a>
                  <a
                    href={user ? "/dashboard" : "/register"}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                  >
                    {user ? "Dashboard" : "Get Started"}
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: Users,
                    label: "Doctors",
                    value: stats.doctors || 150,
                  },
                  {
                    icon: Calendar,
                    label: "Appointments",
                    value: stats.appointments || 2500,
                  },
                  { icon: Star, label: "Reviews", value: stats.reviews || 800 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center"
                  >
                    <item.icon className="w-4 h-4 text-white/40 mx-auto" />
                    <p className="text-lg font-bold text-white mt-1">
                      {typeof item.value === "number"
                        ? item.value.toLocaleString()
                        : item.value}
                      +
                    </p>
                    <p className="text-[10px] text-white/40">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== SPECIALIZATIONS SECTION ===== */}
      <section className={`py-20 ${sectionBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span
              className={`inline-flex items-center gap-2 ${theme === "dark" ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600"} rounded-full px-4 py-1.5 text-xs font-medium mb-4`}
            >
              <Stethoscope className="w-3 h-3" />
              Our Specialties
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold ${headingColor}`}>
              Expert Care in Every Specialty
            </h2>
            <p className={`text-lg ${textColor} mt-3`}>
              From routine check-ups to complex procedures, we've got you
              covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SPECIALIZATIONS.map(({ icon: Icon, label, color, bg }, i) => (
              <motion.a
                key={label}
                href={`/doctors?specialization=${encodeURIComponent(label)}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group ${theme === "dark" ? "bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-700" : "bg-slate-50 hover:bg-white hover:border-blue-100"} rounded-2xl p-6 text-center transition-all duration-300 border-2 border-transparent hover:shadow-xl`}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <p className={`text-sm font-semibold ${headingColor}`}>
                  {label}
                </p>
                <p className={`text-xs ${textColor} mt-0.5`}>View doctors</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className={`py-16 ${sectionAltBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["👨‍⚕️", "Expert Doctors", stats.doctors || 150, "Top specialists"],
              ["❤️", "Happy Patients", stats.patients || 10000, "Cared for"],
              ["📅", "Appointments", stats.appointments || 2500, "Booked"],
              ["⭐", "Reviews", stats.reviews || 800, "4.9/5 average"],
            ].map(([emoji, label, value, sub], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`${cardBg} rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border ${borderColor}`}
              >
                <span className="text-3xl">{emoji}</span>
                <p className={`text-3xl font-bold ${headingColor} mt-2`}>
                  {typeof value === "number" ? value.toLocaleString() : value}+
                </p>
                <p className={`text-sm font-medium ${headingColor}`}>{label}</p>
                <p className={`text-xs ${textColor} mt-0.5`}>{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DOCTORS ===== */}
      <section className={`py-20 ${sectionBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span
                className={`inline-flex items-center gap-2 ${theme === "dark" ? "bg-amber-950/50 text-amber-400" : "bg-amber-50 text-amber-600"} rounded-full px-4 py-1.5 text-xs font-medium mb-3`}
              >
                <Award className="w-3 h-3" />
                Top Rated
              </span>
              <h2 className={`text-3xl sm:text-4xl font-bold ${headingColor}`}>
                Meet Our Expert Doctors
              </h2>
              <p className={`text-lg ${textColor} mt-1`}>
                Trusted by thousands for their expertise and care.
              </p>
            </div>
            <a
              href="/doctors"
              className="hidden sm:inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDoctors.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <DoctorCard doctor={d} />
              </motion.div>
            ))}
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`${cardAltBg} rounded-2xl p-6 h-64 animate-pulse`}
                />
              ))}
            {!loading && featuredDoctors.length === 0 && (
              <div
                className={`col-span-3 text-center py-12 ${cardAltBg} rounded-2xl`}
              >
                <p className={textColor}>No doctors found yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className={`py-20 ${sectionAltBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span
              className={`inline-flex items-center gap-2 ${theme === "dark" ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-50 text-emerald-600"} rounded-full px-4 py-1.5 text-xs font-medium mb-4`}
            >
              <Shield className="w-3 h-3" />
              Why Choose Us
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold ${headingColor}`}>
              Healthcare That Puts You First
            </h2>
            <p className={`text-lg ${textColor} mt-3`}>
              We're redefining healthcare with technology, trust, and
              compassion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Verified Doctors",
                desc: "Every specialist is thoroughly verified before joining our platform.",
                color: "blue",
              },
              {
                icon: Clock,
                title: "24/7 Access",
                desc: "Book appointments anytime, anywhere with real-time availability.",
                color: "emerald",
              },
              {
                icon: MessageCircle,
                title: "Secure Chat",
                desc: "Communicate with your doctor through our secure messaging system.",
                color: "purple",
              },
              {
                icon: Video,
                title: "Video Consult",
                desc: "Connect with specialists from the comfort of your home.",
                color: "rose",
              },
            ].map(({ icon: Icon, title, desc, color }, i) => {
              const colors = {
                blue: `${theme === "dark" ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600"}`,
                emerald: `${theme === "dark" ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`,
                purple: `${theme === "dark" ? "bg-purple-950/50 text-purple-400" : "bg-purple-50 text-purple-600"}`,
                rose: `${theme === "dark" ? "bg-rose-950/50 text-rose-400" : "bg-rose-50 text-rose-600"}`,
              };
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`${cardBg} rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border ${borderColor} group`}
                >
                  <div
                    className={`w-14 h-14 mx-auto rounded-2xl ${colors[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-bold ${headingColor}`}>
                    {title}
                  </h3>
                  <p className={`text-sm ${textColor} mt-2 leading-relaxed`}>
                    {desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={`py-20 ${sectionBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span
              className={`inline-flex items-center gap-2 ${theme === "dark" ? "bg-indigo-950/50 text-indigo-400" : "bg-indigo-50 text-indigo-600"} rounded-full px-4 py-1.5 text-xs font-medium mb-4`}
            >
              <Quote className="w-3 h-3" />
              Patient Stories
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold ${headingColor}`}>
              Real Stories from Real Patients
            </h2>
            <p className={`text-lg ${textColor} mt-3`}>
              Hear what our patients have to say about their experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`${cardAltBg} rounded-2xl p-6 hover:${cardBg} hover:shadow-xl transition-all duration-300 border ${borderColor} hover:border-slate-200 dark:hover:border-slate-700`}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${idx < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}`}
                    />
                  ))}
                </div>
                <p
                  className={`text-sm ${textColor} leading-relaxed line-clamp-3`}
                >
                  "{t.reviewText}"
                </p>
                <div
                  className={`mt-4 pt-4 border-t ${borderColor} flex items-center gap-3`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center">
                    {(t.patientName || "P")[0]}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${headingColor}`}>
                      {t.patientName || "Patient"}
                    </p>
                    <p className={`text-xs ${textColor}`}>{t.doctorName}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {testimonials.length === 0 && !loading && (
              <div
                className={`col-span-3 text-center py-12 ${cardAltBg} rounded-2xl`}
              >
                <p className={textColor}>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 p-12 sm:p-16 text-center"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
              <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-40 w-48 h-48 bg-amber-400 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-1.5 text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                Start Your Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to Take Charge of Your Health?
              </h2>
              <p className="text-lg text-white/80 mt-3 max-w-xl mx-auto">
                Join thousands of patients who trust us for their healthcare
                needs.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-8">
                {mounted && user ? (
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-900 font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href="/register"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-900 font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
                <a
                  href="/doctors"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium px-8 py-3.5 rounded-full transition-all duration-300"
                >
                  Browse Doctors
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
