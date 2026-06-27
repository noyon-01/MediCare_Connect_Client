"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { CreditCard, Receipt, Calendar, User, Stethoscope, CheckCircle2 } from "lucide-react";

export default function AdminPayments() {
  const { data: session } = authClient.useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/payments`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setPayments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalPaid = payments.reduce((sum, p) => sum + (p.status === "Refunded" ? 0 : parseFloat(p.amount || 0)), 0);
  const activePayments = payments.filter(p => p.status !== "Refunded");
  const averageAmount = activePayments.length ? (totalPaid / activePayments.length).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Monitor Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Audit platform consultation fees, payments, and transaction logs.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Total Revenue
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            ${totalPaid.toFixed(2)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Transactions Logged
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {payments.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Average Consultation Cost
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            ${averageAmount}
          </p>
        </div>
      </div>

      {/* Transactions list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            Transactions Log
          </h3>
          <span className="text-xs text-gray-500">
            {payments.length} records
          </span>
        </div>
        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-8 h-8 mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-900">
              No payments recorded yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Patient & Doctor
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date & Time
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Transaction ID
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-gray-55/50">
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {pay.patientName || `ID: ${pay.patientId}`}
                        </p>
                        <p className="text-xs text-blue-600 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
                          Dr. {pay.doctorName || `ID: ${pay.doctorId}`}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(pay.paymentDate).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[11px] font-mono text-gray-600">
                        <Receipt className="w-3.5 h-3.5 text-gray-400" />
                        {pay.transactionId || "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <PaymentPill status={pay.status || 'Paid'} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-900">
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

function PaymentPill({ status }) {
  const normalized = (status || "").toLowerCase();
  if (normalized === "paid") {
    return (
      <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 whitespace-nowrap">
        <CheckCircle2 className="w-3 h-3 text-green-600" />
        Paid
      </span>
    );
  }
  if (normalized === "refunded") {
    return (
      <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-full px-2.5 py-1 text-xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap">
      Unpaid
    </span>
  );
}
