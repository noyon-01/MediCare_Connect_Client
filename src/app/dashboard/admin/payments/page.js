"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  CreditCard,
  Receipt,
  Calendar,
  User,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function AdminPayments() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!session?.user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/payments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
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
  const divider = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const divLight = theme === "dark" ? "border-slate-800/50" : "border-gray-100";
  const tableHeader = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const tableRowHover =
    theme === "dark" ? "hover:bg-slate-800/50" : "hover:bg-gray-50/50";
  const emptyIcon = theme === "dark" ? "text-slate-600" : "text-gray-300";
  const patientText = theme === "dark" ? "text-slate-300" : "text-gray-600";
  const doctorText = theme === "dark" ? "text-blue-400" : "text-blue-600";
  const doctorIcon = theme === "dark" ? "text-blue-500" : "text-blue-400";
  const iconColor = theme === "dark" ? "text-slate-500" : "text-gray-400";
  const tagBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-600";
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

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalPaid = payments.reduce(
    (sum, p) => sum + (p.status === "Refunded" ? 0 : parseFloat(p.amount || 0)),
    0,
  );
  const activePayments = payments.filter((p) => p.status !== "Refunded");
  const averageAmount = activePayments.length
    ? (totalPaid / activePayments.length).toFixed(2)
    : 0;

  return (
    <div className={`space-y-6 ${bgMain} transition-colors duration-300`}>
      {/* Title */}
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${textPrimary} transition-colors duration-300`}
        >
          Monitor Payments
        </h1>
        <p
          className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}
        >
          Audit platform consultation fees, payments, and transaction logs.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`${bgCard} border ${cardBorder} rounded-xl p-5 transition-colors duration-300`}
        >
          <p
            className={`text-xs font-medium ${textSecondary} uppercase tracking-wide transition-colors duration-300`}
          >
            Total Revenue
          </p>
          <p
            className={`mt-2 text-2xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
          >
            ${totalPaid.toFixed(2)}
          </p>
        </div>
        <div
          className={`${bgCard} border ${cardBorder} rounded-xl p-5 transition-colors duration-300`}
        >
          <p
            className={`text-xs font-medium ${textSecondary} uppercase tracking-wide transition-colors duration-300`}
          >
            Transactions Logged
          </p>
          <p
            className={`mt-2 text-2xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
          >
            {payments.length}
          </p>
        </div>
        <div
          className={`${bgCard} border ${cardBorder} rounded-xl p-5 transition-colors duration-300`}
        >
          <p
            className={`text-xs font-medium ${textSecondary} uppercase tracking-wide transition-colors duration-300`}
          >
            Average Consultation Cost
          </p>
          <p
            className={`mt-2 text-2xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
          >
            ${averageAmount}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div
        className={`${bgCard} border ${cardBorder} rounded-xl overflow-hidden transition-colors duration-300`}
      >
        <div
          className={`px-5 py-4 border-b ${divider} flex items-center justify-between transition-colors duration-300`}
        >
          <h3
            className={`text-base font-semibold ${textPrimary} transition-colors duration-300`}
          >
            Transactions Log
          </h3>
          <span
            className={`text-xs ${textSecondary} transition-colors duration-300`}
          >
            {payments.length} records
          </span>
        </div>
        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard
              className={`w-8 h-8 mx-auto ${emptyIcon} mb-3 transition-colors duration-300`}
            />
            <p
              className={`text-sm font-semibold ${textPrimary} transition-colors duration-300`}
            >
              No payments recorded yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr
                  className={`border-b ${divider} text-left transition-colors duration-300`}
                >
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Patient & Doctor
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Date & Time
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Transaction ID
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300 text-right`}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${divLight}`}>
                {payments.map((pay) => (
                  <tr
                    key={pay._id}
                    className={`${tableRowHover} transition-colors duration-200`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        <p
                          className={`text-sm font-semibold ${textPrimary} flex items-center gap-1.5 transition-colors duration-300`}
                        >
                          <User className={`w-3.5 h-3.5 ${iconColor}`} />
                          {pay.patientName || `ID: ${pay.patientId}`}
                        </p>
                        <p
                          className={`text-xs ${doctorText} flex items-center gap-1.5 transition-colors duration-300`}
                        >
                          <Stethoscope
                            className={`w-3.5 h-3.5 ${doctorIcon}`}
                          />
                          Dr. {pay.doctorName || `ID: ${pay.doctorId}`}
                        </p>
                      </div>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-sm ${textSecondary} transition-colors duration-300`}
                    >
                      <span
                        className={`inline-flex items-center gap-1 ${textSecondary}`}
                      >
                        <Calendar className={`w-3.5 h-3.5 ${iconColor}`} />
                        {new Date(pay.paymentDate).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 ${tagBg} border rounded-full px-2 py-0.5 text-[11px] font-mono transition-colors duration-300`}
                      >
                        <Receipt className={`w-3.5 h-3.5 ${iconColor}`} />
                        {pay.transactionId || "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <PaymentPill
                        status={pay.status || "Paid"}
                        theme={theme}
                      />
                    </td>
                    <td
                      className={`px-5 py-3.5 text-right font-bold ${textPrimary} transition-colors duration-300`}
                    >
                      ${parseFloat(pay.amount || 0).toFixed(2)}
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
