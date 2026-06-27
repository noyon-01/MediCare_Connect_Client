"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { CreditCard, Receipt, CheckCircle2 } from "lucide-react";

export default function PatientPayments() {
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-appointments?patientId=${session.user.id}`)
      .then(res => res.json())
      .then(data => {
        // filter paid or refunded appointments
        const paid = data.filter(a => a.paymentStatus === "Paid" || a.paymentStatus === "Refunded");
        setAppointments(paid);
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

  const totalPaid = appointments.reduce((sum, a) => sum + (a.paymentStatus === "Refunded" ? 0 : parseFloat(a.amount || 0)), 0);
  const lastPaid = appointments[0] ? appointments[0].appointmentDate : "—";

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payment History</h1>
        <p className="text-sm text-gray-500 mt-1">Verify and monitor your paid consultations and receipts.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Total Paid
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            ${totalPaid.toFixed(2)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Transactions
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {appointments.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Last Paid Date
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {lastPaid}
          </p>
        </div>
      </div>

      {/* Transactions list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            Transactions
          </h3>
          <span className="text-xs text-gray-500">
            {appointments.length} records
          </span>
        </div>
        {appointments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-8 h-8 mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-900">
              No payments yet
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Once you pay for an appointment, it'll appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Doctor
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date
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
                {appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-55/50">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-gray-900">
                        {app.doctorName}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      {app.appointmentDate} at {app.appointmentTime}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[11px] font-mono text-gray-600">
                        <Receipt className="w-3 h-3 text-gray-400" />
                        {app.transactionId || "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <PaymentPill status={app.paymentStatus} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                      ${parseFloat(app.amount || 0).toFixed(2)}
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
