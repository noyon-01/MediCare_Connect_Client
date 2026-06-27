"use client";
import { motion } from "framer-motion";
import { Shield, Heart, Award, Users, Sparkles, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function About() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgAlt = theme === "dark" ? "bg-slate-900" : "bg-gray-50";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const cardHoverBorder =
    theme === "dark" ? "hover:border-slate-700" : "hover:border-gray-300";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const badgeBg =
    theme === "dark"
      ? "bg-blue-950/30 text-blue-400"
      : "bg-blue-50 text-blue-600";
  const iconBg = theme === "dark" ? "bg-blue-950/30" : "bg-blue-50";
  const iconColor = theme === "dark" ? "text-blue-400" : "text-blue-600";
  const statBg = theme === "dark" ? "bg-slate-900" : "bg-white";
  const statBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const ctaBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-gray-200";
  const ctaText = theme === "dark" ? "text-slate-400" : "text-gray-600";
  const divider = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const btnSecondary =
    theme === "dark"
      ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
      : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700";

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${bgMain} transition-colors duration-300`}>
      {/* ===== HERO SECTION ===== */}
      <section className={`border-b ${divider} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span
              className={`inline-flex items-center gap-1.5 ${badgeBg} rounded-full px-3 py-1 text-xs font-medium mb-4 transition-colors duration-300`}
            >
              <Sparkles className="w-3 h-3" /> Our mission
            </span>
            <h1
              className={`text-3xl sm:text-5xl font-semibold tracking-tight ${textPrimary} leading-tight transition-colors duration-300`}
            >
              We're rebuilding healthcare to feel like care again.
            </h1>
            <p
              className={`mt-5 text-base ${textSecondary} leading-relaxed transition-colors duration-300`}
            >
              Healthcare has spent decades getting more powerful and more
              confusing — at the same time. MediCare Connect exists to put
              clarity back at the center of the experience for both patients and
              providers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section
        className={`${bgAlt} border-b ${divider} transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Patients served", value: "10,000+" },
              { label: "Verified specialists", value: "150+" },
              { label: "Average rating", value: "4.9 / 5" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className={`${statBg} border ${statBorder} rounded-xl p-6 transition-colors duration-300`}
              >
                <p
                  className={`text-xs font-medium ${textSecondary} uppercase tracking-wide transition-colors duration-300`}
                >
                  {label}
                </p>
                <p
                  className={`mt-2 text-3xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BELIEFS SECTION ===== */}
      <section className={`border-b ${divider} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2
            className={`text-2xl sm:text-3xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
          >
            What we believe
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Heart,
                title: "Care over convenience",
                desc: "Every product decision starts with whether it improves outcomes — not just clicks.",
              },
              {
                icon: Shield,
                title: "Trust is non-negotiable",
                desc: "Verified providers, encrypted records, and transparent pricing — by default.",
              },
              {
                icon: Award,
                title: "Quality, not vanity",
                desc: "Honest ratings tied to confirmed visits. No fake reviews. No padded credentials.",
              },
              {
                icon: Users,
                title: "Built with providers",
                desc: "Doctors helped design this platform. It works the way real clinics actually work.",
              },
              {
                icon: Zap,
                title: "Instant by default",
                desc: "Booking, payments, prescriptions — no waiting on confirmation calls.",
              },
              {
                icon: Sparkles,
                title: "Quiet by design",
                desc: "We respect your attention. No spam, no upsells, no dark patterns.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className={`${bgCard} border ${cardBorder} ${cardHoverBorder} rounded-xl p-5 transition-all duration-300`}
              >
                <div
                  className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center mb-3 transition-colors duration-300`}
                >
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <h3
                  className={`text-sm font-semibold ${textPrimary} transition-colors duration-300`}
                >
                  {title}
                </h3>
                <p
                  className={`text-sm ${textSecondary} mt-1 leading-relaxed transition-colors duration-300`}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className={`${bgAlt} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div
            className={`${ctaBg} border ${cardBorder} rounded-2xl p-8 sm:p-12 transition-colors duration-300`}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2
                  className={`text-2xl sm:text-3xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
                >
                  Ready to experience it?
                </h2>
                <p
                  className={`text-sm ${textSecondary} mt-3 leading-relaxed transition-colors duration-300`}
                >
                  Create your account and book your first appointment in less
                  than two minutes.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/register"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Get started
                  </a>
                  <a
                    href="/contact"
                    className={`inline-flex items-center ${btnSecondary} text-sm font-medium px-5 py-2.5 rounded-lg transition-colors border`}
                  >
                    Talk to us
                  </a>
                </div>
              </div>
              <div
                className={`space-y-2 text-sm ${ctaText} transition-colors duration-300`}
              >
                {[
                  "Same-day appointments where available",
                  "Stripe-secured consultation payments",
                  "Records that follow you across providers",
                  "Emergency Hotline available 24/7 (911)",
                ].map((t) => (
                  <div key={t} className="py-1 flex items-start gap-2">
                    <span className={`${textSecondary} mt-0.5`}>✓</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
