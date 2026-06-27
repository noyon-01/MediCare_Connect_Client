"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate sending message
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Thank you! We will get back to you within 24 hours.");
    e.target.reset();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 mb-3">
              Get in touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              We'd love to hear from you.
            </h1>
            <p className="mt-3 text-sm text-gray-500 max-w-md">
              Whether you have a question, feedback, or a partnership idea —
              send us a note.
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-8 bg-white border border-gray-200 rounded-xl p-6 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Full name
                  </label>
                  <input
                    required
                    name="name"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Subject
                </label>
                <input
                  required
                  name="subject"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  name="message"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-5 py-2.5 disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          </div>

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
                className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm text-gray-900 mt-0.5 font-medium">
                      {value}
                    </p>
                  </div>
                </div>
              </a>
            ))}

            <div className="bg-gray-900 rounded-xl p-5">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white rounded-full px-2.5 py-1 text-xs font-medium mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Emergency hotline (911)
              </span>
              <p className="text-xs text-gray-400">Available 24/7</p>
              <a
                href="tel:1-800-MEDICARE"
                className="block text-2xl font-semibold tracking-tight text-white mt-1"
              >
                1-800-MEDICARE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
