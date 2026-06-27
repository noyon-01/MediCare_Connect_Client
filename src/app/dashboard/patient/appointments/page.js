"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Calendar,
  X,
  CheckCircle2,
  Clock,
  Edit2,
  Stethoscope,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function PatientAppointments() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [rescheduling, setRescheduling] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rescheduleDoctor, setRescheduleDoctor] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getNextDates = (doctor) => {
    if (!doctor) return [];
    const out = [];
    const dayMap = {
      Sunday: 0,
      Mon: 1,
      Monday: 1,
      Tue: 2,
      Tuesday: 2,
      Wed: 3,
      Wednesday: 3,
      Thu: 4,
      Thursday: 4,
      Fri: 5,
      Friday: 5,
      Sat: 6,
      Saturday: 6,
    };
    const dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const allowed = (doctor.availableDays || []).map((d) => dayMap[d]);
    const now = new Date();

    for (let i = 0; i < 21 && out.length < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      if (allowed.length === 0 || allowed.includes(d.getDay())) {
        const iso = d.toISOString().slice(0, 10);
        const fullName =
          Object.keys(dayMap).find(
            (k) => dayMap[k] === d.getDay() && k.length > 3,
          ) || dayShort[d.getDay()];
        out.push({
          iso,
          display: `${fullName} (${iso})`,
        });
      }
    }
    return out;
  };

  const fetchAppointments = () => {
    if (!session?.user?.id) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-appointments?patientId=${session.user.id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          console.error("Failed to load appointments:", data?.error || data);
          toast.error(data?.error || "Failed to load appointments");
          setAppointments([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Network error loading appointments.");
        setAppointments([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAppointments();
  }, [session]);

  useEffect(() => {
    if (typeof window === "undefined" || !session?.user?.id) return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) return;

    const verifySession = async () => {
      setVerifyingPayment(true);
      const toastId = toast.loading(
        "Verifying payment and booking appointment...",
      );
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/verify-checkout-session`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          },
        );
        const data = await res.json();
        if (data.success) {
          toast.success("Appointment booked and paid successfully!", {
            id: toastId,
          });
          fetchAppointments();
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } else {
          toast.error(data.message || "Payment verification failed.", {
            id: toastId,
          });
        }
      } catch (err) {
        toast.error("Error verifying payment: " + err.message, { id: toastId });
      } finally {
        setVerifyingPayment(false);
      }
    };

    verifySession();
  }, [session]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentStatus: "Cancelled" }),
        },
      );
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success("Appointment cancelled successfully.");
        fetchAppointments();
      } else {
        toast.error("Failed to cancel appointment.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!rescheduling) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${rescheduling._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentDate: newDate,
            appointmentTime: newTime,
            appointmentStatus: "Pending",
          }),
        },
      );
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success("Appointment rescheduled successfully!");
        setRescheduling(null);
        fetchAppointments();
      } else {
        toast.error("Failed to reschedule.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter(
          (a) => (a.appointmentStatus || "").toLowerCase() === filter,
        );

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const divider = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const divLight = theme === "dark" ? "border-slate-800/50" : "border-gray-100";
  const tabActive =
    theme === "dark"
      ? "text-white border-blue-400"
      : "text-gray-900 border-blue-600";
  const tabInactive =
    theme === "dark"
      ? "text-slate-400 hover:text-slate-300"
      : "text-gray-500 hover:text-gray-700";
  const emptyBg = theme === "dark" ? "bg-slate-900" : "bg-white";
  const avatarBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700"
      : "bg-gray-100 border-gray-200";
  const tagBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const modalBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-gray-200";
  const overlayBg = theme === "dark" ? "bg-black/60" : "bg-black/40";
  const inputBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const inputBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${bgMain} transition-colors duration-300`}>
      {/* Title */}
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${textPrimary} transition-colors duration-300`}
        >
          My Appointments
        </h1>
        <p
          className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}
        >
          Manage your consultation schedules and booking details.
        </p>
      </div>

      {/* Tabs */}
      <div
        className={`border-b ${divider} flex items-center gap-1 overflow-x-auto whitespace-nowrap transition-colors duration-300`}
      >
        {[
          ["all", "All"],
          ["pending", "Pending"],
          ["accepted", "Accepted"],
          ["completed", "Completed"],
          ["cancelled", "Cancelled"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`pb-3 px-3 text-sm border-b-2 transition-colors -mb-[1px] ${
              filter === k
                ? `${tabActive} font-medium`
                : `${tabInactive} font-normal border-transparent`
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div
          className={`${emptyBg} border ${cardBorder} rounded-xl p-12 text-center transition-colors duration-300`}
        >
          <Calendar className={`w-8 h-8 mx-auto ${textMuted} mb-3`} />
          <p className={`text-sm font-semibold ${textPrimary}`}>
            No appointments found
          </p>
          <p className={`text-xs ${textSecondary} mt-1`}>
            Once you book or have history, it will show up here.
          </p>
        </div>
      ) : (
        <div
          className={`${bgCard} border ${cardBorder} rounded-xl divide-y ${divLight} transition-colors duration-300`}
        >
          {filtered.map((a) => (
            <div key={a._id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-lg ${avatarBg} overflow-hidden flex-shrink-0 flex items-center justify-center transition-colors duration-300`}
                  >
                    {a.doctorPhoto ? (
                      <img
                        src={a.doctorPhoto}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${textMuted} text-sm font-semibold`}
                      >
                        {(a.doctorName || "D")[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${textPrimary} transition-colors duration-300`}
                    >
                      {a.doctorName}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span
                        className={`inline-flex items-center gap-1 ${tagBg} border rounded-full px-2.5 py-1 text-xs transition-colors duration-300`}
                      >
                        <Calendar className={`w-3 h-3 ${textMuted}`} />
                        {a.appointmentDate}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 ${tagBg} border rounded-full px-2.5 py-1 text-xs transition-colors duration-300`}
                      >
                        <Clock className={`w-3 h-3 ${textMuted}`} />
                        {a.appointmentTime}
                      </span>
                      <StatusPill status={a.appointmentStatus} theme={theme} />
                      <PaymentPill status={a.paymentStatus} theme={theme} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  {a.appointmentStatus !== "Completed" &&
                    a.appointmentStatus !== "Cancelled" && (
                      <>
                        <button
                          onClick={() => {
                            setRescheduling(a);
                            setNewDate("");
                            setNewTime("");
                            setRescheduleDoctor(null);
                            fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/doctors/${a.doctorId}`,
                            )
                              .then((res) => res.json())
                              .then((data) => {
                                if (!data.error) {
                                  setRescheduleDoctor(data);
                                } else {
                                  toast.error(
                                    "Could not load doctor availability.",
                                  );
                                }
                              })
                              .catch((err) => {
                                console.error(err);
                                toast.error("Error loading doctor profile.");
                              });
                          }}
                          className={`inline-flex items-center gap-1 ${tagBg} border rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700`}
                        >
                          <Edit2 className="w-3 h-3" />
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(a._id)}
                          className="inline-flex items-center gap-1 bg-transparent hover:bg-red-50 dark:hover:bg-red-950/30 border border-gray-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition-all duration-200"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </button>
                      </>
                    )}
                </div>
              </div>
              {a.symptoms && (
                <p
                  className={`mt-3 pt-3 border-t ${divLight} text-xs ${textSecondary} transition-colors duration-300`}
                >
                  <span className={textMuted}>Symptoms: </span>
                  {a.symptoms}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduling && (
        <div
          onClick={() => setRescheduling(null)}
          className={`fixed inset-0 z-50 ${overlayBg} flex items-center justify-center p-4 backdrop-blur-xs`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${modalBg} border ${cardBorder} rounded-xl p-6 max-w-sm w-full shadow-2xl transition-colors duration-300`}
          >
            <h3 className={`text-base font-semibold ${textPrimary}`}>
              Reschedule Consultation
            </h3>
            <p className={`text-xs ${textSecondary} mt-1`}>
              With {rescheduling.doctorName}
            </p>
            <form onSubmit={handleReschedule} className="mt-4 space-y-4">
              {!rescheduleDoctor ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <div>
                    <label
                      className={`block text-xs font-medium ${textSecondary} mb-1.5 transition-colors duration-300`}
                    >
                      Select New Date
                    </label>
                    <select
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                      required
                    >
                      <option value="">Select a date</option>
                      {getNextDates(rescheduleDoctor).map((d) => (
                        <option key={d.iso} value={d.display}>
                          {d.display}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-medium ${textSecondary} mb-1.5 transition-colors duration-300`}
                    >
                      Select New Time Slot
                    </label>
                    <select
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                      required
                    >
                      <option value="">Select a time slot</option>
                      {(rescheduleDoctor?.availableSlots || []).map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setRescheduling(null)}
                  className={`px-3 py-2 text-sm ${textSecondary} hover:${textPrimary} rounded-lg border ${cardBorder} transition-colors duration-300`}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, theme }) {
  const normalized = (status || "").toLowerCase();
  const map = {
    pending: { dot: "bg-orange-500", label: "Pending" },
    accepted: { dot: "bg-green-500", label: "Accepted" },
    confirmed: { dot: "bg-green-500", label: "Confirmed" },
    completed: { dot: "bg-blue-500", label: "Completed" },
    cancelled: { dot: "bg-red-500", label: "Cancelled" },
    rejected: { dot: "bg-red-500", label: "Rejected" },
  };
  const s = map[normalized] || { dot: "bg-gray-400", label: status };
  const bg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${bg} border rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition-colors duration-300`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function PaymentPill({ status, theme }) {
  const normalized = (status || "").toLowerCase();
  const bg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700"
      : "bg-white border-gray-200";
  const text = theme === "dark" ? "text-slate-300" : "text-gray-700";

  if (normalized === "paid") {
    return (
      <span
        className={`inline-flex items-center gap-1 ${bg} border rounded-full px-2.5 py-1 text-xs ${text} whitespace-nowrap transition-colors duration-300`}
      >
        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
        Paid
      </span>
    );
  }
  if (normalized === "refunded") {
    return (
      <span
        className={`inline-flex items-center gap-1 ${theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-gray-50 border-gray-200 text-gray-500"} border rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition-colors duration-300`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-300">
      Unpaid
    </span>
  );
}
