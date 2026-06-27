"use client";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export default function Contact() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Thank you! We will get back to you within 24 hours.");
    e.target.reset();
    setSubmitting(false);
  };

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const cardHoverBorder =
    theme === "dark" ? "hover:border-slate-700" : "hover:border-gray-300";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const inputBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const inputBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const inputFocus =
    theme === "dark"
      ? "focus-visible:ring-blue-500"
      : "focus-visible:ring-blue-600";
  const labelColor = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const badgeBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const iconBg = theme === "dark" ? "bg-blue-950/30" : "bg-blue-50";
  const iconColor = theme === "dark" ? "text-blue-400" : "text-blue-600";
  const emergencyBg = theme === "dark" ? "bg-slate-800" : "bg-gray-900";
  const emergencyText = theme === "dark" ? "text-slate-300" : "text-gray-400";
  const btnBg =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-blue-600 hover:bg-blue-700";

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${bgMain} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Left Column - Form */}
          <div>
            <span
              className={`inline-flex items-center gap-1.5 ${badgeBg} border rounded-full px-2.5 py-1 text-xs transition-colors duration-300`}
            >
              Get in touch
            </span>
            <h1
              className={`text-3xl sm:text-4xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
            >
              We'd love to hear from you.
            </h1>
            <p
              className={`mt-3 text-sm ${textSecondary} max-w-md transition-colors duration-300`}
            >
              Whether you have a question, feedback, or a partnership idea —
              send us a note.
            </p>

            <form
              onSubmit={onSubmit}
              className={`mt-8 ${bgCard} border ${cardBorder} rounded-xl p-6 space-y-4 transition-colors duration-300`}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-medium ${labelColor} mb-1.5 transition-colors duration-300`}
                  >
                    Full name
                  </label>
                  <input
                    required
                    name="name"
                    className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 ${inputFocus} transition-colors duration-300`}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    className={`block text-xs font-medium ${labelColor} mb-1.5 transition-colors duration-300`}
                  >
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 ${inputFocus} transition-colors duration-300`}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  className={`block text-xs font-medium ${labelColor} mb-1.5 transition-colors duration-300`}
                >
                  Subject
                </label>
                <input
                  required
                  name="subject"
                  className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 ${inputFocus} transition-colors duration-300`}
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-medium ${labelColor} mb-1.5 transition-colors duration-300`}
                >
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  name="message"
                  className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 ${inputFocus} transition-colors duration-300`}
                  placeholder="Tell us what's on your mind..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center gap-1.5 rounded-lg ${btnBg} transition-colors text-white text-sm font-medium px-5 py-2.5 disabled:opacity-60`}
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "support@medicareconnect.app",
                href: "mailto:support@medicareconnect.app",
              },
              {
                icon: Phone,
                label: "Phone",
                value: "+1 (617) 555-0188",
                href: "tel:+16175550188",
              },
              {
                icon: MapPin,
                label: "Office",
                value: "240 Wellness Avenue, Boston, MA",
              },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href || "#"}
                className={`block ${bgCard} border ${cardBorder} rounded-xl p-5 ${cardHoverBorder} transition-all duration-300`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center transition-colors duration-300`}
                  >
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium ${textSecondary} uppercase tracking-wide transition-colors duration-300`}
                    >
                      {label}
                    </p>
                    <p
                      className={`text-sm ${textPrimary} mt-0.5 font-medium transition-colors duration-300`}
                    >
                      {value}
                    </p>
                  </div>
                </div>
              </a>
            ))}

            {/* Emergency Hotline */}
            <div
              className={`${emergencyBg} rounded-xl p-5 transition-colors duration-300`}
            >
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white rounded-full px-2.5 py-1 text-xs font-medium mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Emergency hotline (911)
              </span>
              <p className={`text-xs ${emergencyText}`}>Available 24/7</p>
              <a
                href="tel:1-800-MEDICARE"
                className="block text-2xl font-semibold tracking-tight text-white mt-1 hover:text-blue-400 transition-colors"
              >
                1-800-MEDICARE
              </a>
            </div>

            {/* Working Hours */}
            <div
              className={`${bgCard} border ${cardBorder} rounded-xl p-5 transition-colors duration-300`}
            >
              <h4
                className={`text-xs font-semibold ${textSecondary} uppercase tracking-wider mb-3`}
              >
                Working Hours
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Monday - Friday</span>
                  <span className={textPrimary}>8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Saturday</span>
                  <span className={textPrimary}>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Sunday</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-medium">
                    Closed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
