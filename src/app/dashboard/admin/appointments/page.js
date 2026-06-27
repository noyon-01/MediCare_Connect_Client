"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Calendar,
  Clock,
  Inbox,
  User,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function AdminAppointments() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!session?.user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/appointments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [session]);

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const tableHeader = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const tableRowHover =
    theme === "dark" ? "hover:bg-slate-800/50" : "hover:bg-gray-50/50";
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
  const emptyIcon = theme === "dark" ? "text-slate-600" : "text-gray-300";
  const patientText = theme === "dark" ? "text-slate-300" : "text-gray-600";
  const doctorText = theme === "dark" ? "text-blue-400" : "text-blue-600";
  const doctorIcon = theme === "dark" ? "text-blue-500" : "text-blue-400";
  const iconColor = theme === "dark" ? "text-slate-500" : "text-gray-400";
  const statusPillBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const paymentPaid =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const paymentRefunded =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-500"
      : "bg-gray-50 border-gray-200 text-gray-500";
  const paymentUnpaid =
    theme === "dark"
      ? "bg-blue-950/30 text-blue-400"
      : "bg-blue-50 text-blue-600";

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter(
          (a) => (a.appointmentStatus || "").toLowerCase() === filter,
        );

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
          Monitor Appointments
        </h1>
        <p
          className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}
        >
          Oversee all clinical schedule bookings and statuses across the
          platform.
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
          ["rejected", "Rejected"],
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

      {/* Table Card */}
      <div
        className={`${bgCard} border ${cardBorder} rounded-xl overflow-hidden transition-colors duration-300`}
      >
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox
              className={`w-8 h-8 mx-auto ${emptyIcon} mb-3 transition-colors duration-300`}
            />
            <p
              className={`text-sm font-semibold ${textPrimary} transition-colors duration-300`}
            >
              No appointments found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead
                className={`border-b ${divider} transition-colors duration-300`}
              >
                <tr className="text-left">
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Patient & Doctor
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Schedule Details
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Symptoms
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${divLight}`}>
                {filtered.map((app) => (
                  <tr
                    key={app._id}
                    className={`${tableRowHover} transition-colors duration-200`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        <p
                          className={`text-sm font-semibold ${textPrimary} flex items-center gap-1.5 transition-colors duration-300`}
                        >
                          <User className={`w-3.5 h-3.5 ${iconColor}`} />
                          {app.patientName}
                        </p>
                        <p
                          className={`text-xs ${doctorText} flex items-center gap-1.5 transition-colors duration-300`}
                        >
                          <Stethoscope
                            className={`w-3.5 h-3.5 ${doctorIcon}`}
                          />
                          Dr. {app.doctorName}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 ${textPrimary} transition-colors duration-300`}
                        >
                          <Calendar className={`w-3.5 h-3.5 ${iconColor}`} />
                          {app.appointmentDate}
                        </span>
                        <br />
                        <span
                          className={`inline-flex items-center gap-1 ${textPrimary} transition-colors duration-300`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${iconColor}`} />
                          {app.appointmentTime}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-xs ${textSecondary} max-w-xs truncate transition-colors duration-300`}
                    >
                      {app.symptoms || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill
                        status={app.appointmentStatus}
                        theme={theme}
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <PaymentPill status={app.paymentStatus} theme={theme} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
  const paidBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const refundedBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-500"
      : "bg-gray-50 border-gray-200 text-gray-500";
  const unpaidBg =
    theme === "dark"
      ? "bg-blue-950/30 text-blue-400"
      : "bg-blue-50 text-blue-600";

  if (normalized === "paid") {
    return (
      <span
        className={`inline-flex items-center gap-1 ${paidBg} border rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition-colors duration-300`}
      >
        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
        Paid
      </span>
    );
  }
  if (normalized === "refunded") {
    return (
      <span
        className={`inline-flex items-center gap-1 ${refundedBg} border rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition-colors duration-300`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Refunded
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 ${unpaidBg} rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-300`}
    >
      Unpaid
    </span>
  );
}
