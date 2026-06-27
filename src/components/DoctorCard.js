"use client";
import {
  Star,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  ChevronRight,
  User,
  Award,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DoctorCard({ doctor, index = 0 }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const rating = Number(doctor.rating || 0).toFixed(1);
  const isAvailable = Math.random() > 0.3;

  useEffect(() => {
    setMounted(true);
  }, []);

  // রেটিং অনুযায়ী কালার (ডার্ক থিম সাপোর্ট)
  const getRatingColor = (rating) => {
    const num = parseFloat(rating);
    if (num >= 4.5) {
      return theme === "dark"
        ? "text-emerald-400 bg-emerald-950/40 border-emerald-800"
        : "text-emerald-600 bg-emerald-50 border-emerald-200";
    }
    if (num >= 4.0) {
      return theme === "dark"
        ? "text-blue-400 bg-blue-950/40 border-blue-800"
        : "text-blue-600 bg-blue-50 border-blue-200";
    }
    if (num >= 3.5) {
      return theme === "dark"
        ? "text-amber-400 bg-amber-950/40 border-amber-800"
        : "text-amber-600 bg-amber-50 border-amber-200";
    }
    return theme === "dark"
      ? "text-slate-400 bg-slate-800 border-slate-700"
      : "text-slate-600 bg-slate-50 border-slate-200";
  };

  // অভিজ্ঞতা অনুযায়ী লেভেল (ডার্ক থিম সাপোর্ট)
  const getExperienceLevel = (years) => {
    if (years >= 20) {
      return {
        label: "Expert",
        icon: Award,
        color:
          theme === "dark"
            ? "text-purple-400 bg-purple-950/40"
            : "text-purple-600 bg-purple-50",
      };
    }
    if (years >= 10) {
      return {
        label: "Senior",
        icon: Shield,
        color:
          theme === "dark"
            ? "text-blue-400 bg-blue-950/40"
            : "text-blue-600 bg-blue-50",
      };
    }
    return {
      label: "Practitioner",
      icon: User,
      color:
        theme === "dark"
          ? "text-emerald-400 bg-emerald-950/40"
          : "text-emerald-600 bg-emerald-50",
    };
  };

  const expLevel = getExperienceLevel(doctor.experience || 0);
  const ExpIcon = expLevel.icon;

  // Theme based dynamic classes
  const themeClasses = {
    card: `group block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border ${
      theme === "dark"
        ? "bg-slate-900 border-slate-800 hover:border-slate-700"
        : "bg-white border-slate-100 hover:border-blue-200"
    }`,
    textPrimary: theme === "dark" ? "text-white" : "text-slate-900",
    textSecondary: theme === "dark" ? "text-slate-400" : "text-slate-500",
    textMuted: theme === "dark" ? "text-slate-500" : "text-slate-400",
    tagBg: theme === "dark" ? "bg-slate-800" : "bg-slate-50",
    tagBorder: theme === "dark" ? "border-slate-700" : "border-slate-200",
    tagText: theme === "dark" ? "text-slate-300" : "text-slate-600",
    divider: theme === "dark" ? "border-slate-800" : "border-slate-100",
    progressBg: theme === "dark" ? "bg-slate-800" : "bg-slate-100",
    bookBtn:
      theme === "dark"
        ? "bg-blue-950/40 text-blue-400 group-hover:bg-blue-600 group-hover:text-white"
        : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    bookShadow:
      theme === "dark"
        ? "group-hover:shadow-blue-900/30"
        : "group-hover:shadow-blue-200",
    avatarBorder: theme === "dark" ? "border-slate-700" : "border-slate-200",
    avatarHoverBorder:
      theme === "dark"
        ? "group-hover:border-slate-600"
        : "group-hover:border-blue-400",
    avatarBg:
      theme === "dark"
        ? "from-slate-800 to-slate-700"
        : "from-slate-100 to-slate-200",
    statusBorder: theme === "dark" ? "border-slate-900" : "border-white",
    glowBg:
      theme === "dark"
        ? "from-blue-500/10 via-purple-500/10 to-emerald-500/10"
        : "from-blue-500/5 via-purple-500/5 to-emerald-500/5",
  };

  if (!mounted) return null;

  return (
    <motion.a
      href={`/doctors/${doctor._id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className={themeClasses.card}
    >
      {/* Decorative Gradient Top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-5">
        {/* Header - Doctor Info */}
        <div className="flex items-start gap-4">
          {/* Avatar with Status */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br ${themeClasses.avatarBg} border-2 ${themeClasses.avatarBorder} ${themeClasses.avatarHoverBorder} transition-colors duration-300`}
            >
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={doctor.doctorName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b' font-weight='bold'>Dr.</text></svg>";
                  }}
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center ${themeClasses.textMuted} font-bold text-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700`}
                >
                  {(doctor.doctorName || "D")[0]}
                </div>
              )}
            </div>
            {/* Online Status */}
            {isAvailable && (
              <span
                className={`absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 ${themeClasses.statusBorder} rounded-full flex items-center justify-center`}
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3
                  className={`text-base font-bold ${themeClasses.textPrimary} truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300`}
                >
                  {doctor.doctorName}
                </h3>
                <p
                  className={`text-xs ${themeClasses.textSecondary} mt-0.5 flex items-center gap-1.5`}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {doctor.specialization}
                </p>
              </div>
              {/* Rating Badge */}
              <span
                className={`inline-flex items-center gap-1 border rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${getRatingColor(rating)}`}
              >
                <Star className="w-3 h-3 fill-current" />
                {rating}
              </span>
            </div>

            {/* Experience Level Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${expLevel.color}`}
            >
              <ExpIcon className="w-3 h-3" />
              {expLevel.label} · {doctor.experience || 0}+ yrs
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 ${themeClasses.tagBg} border ${themeClasses.tagBorder} rounded-full px-3 py-1.5 text-xs ${themeClasses.tagText}`}
          >
            <Briefcase className={`w-3 h-3 ${themeClasses.textMuted}`} />
            {doctor.experience || 0} Years
          </span>
          <span
            className={`inline-flex items-center gap-1.5 ${themeClasses.tagBg} border ${themeClasses.tagBorder} rounded-full px-3 py-1.5 text-xs ${themeClasses.tagText} truncate max-w-[180px]`}
          >
            <MapPin
              className={`w-3 h-3 ${themeClasses.textMuted} flex-shrink-0`}
            />
            <span className="truncate">
              {doctor.hospitalName || "Not specified"}
            </span>
          </span>
          {isAvailable && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-400">
              <Clock className="w-3 h-3" />
              Available Today
            </span>
          )}
        </div>

        {/* Bottom - Fee & Action */}
        <div
          className={`mt-4 pt-4 border-t ${themeClasses.divider} flex items-center justify-between`}
        >
          <div>
            <p
              className={`text-[10px] ${themeClasses.textMuted} uppercase tracking-wider font-semibold`}
            >
              Consultation Fee
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className={`text-lg font-bold ${themeClasses.textPrimary}`}>
                ${Number(doctor.consultationFee || 0).toFixed(0)}
              </p>
              <span
                className={`text-[10px] ${themeClasses.textMuted} line-through`}
              >
                ${(Number(doctor.consultationFee || 0) * 1.2).toFixed(0)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 ${themeClasses.bookBtn} rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 group-hover:shadow-lg ${themeClasses.bookShadow}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Book
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Hover Overlay Glow */}
        <div
          className={`absolute -inset-full -z-10 bg-gradient-to-r ${themeClasses.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`}
        />
      </div>

      {/* Rating Stars Progress Indicator */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${themeClasses.progressBg}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(parseFloat(rating) / 5) * 100}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 ${
            parseFloat(rating) >= 4.5 ? "from-emerald-400 to-emerald-500" : ""
          }`}
        />
      </div>
    </motion.a>
  );
}
