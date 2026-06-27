"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Calendar, Clock, Inbox, User, Stethoscope, CheckCircle2 } from "lucide-react";

export default function AdminAppointments() {
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!session?.user?.id) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/appointments`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [session]);

  const filtered = filter === "all"
    ? appointments
    : appointments.filter(a => (a.appointmentStatus || "").toLowerCase() === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Monitor Appointments</h1>
        <p className="text-sm text-gray-500 mt-1">Oversee all clinical schedule bookings and statuses across the platform.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
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
                ? "text-gray-900 font-medium border-blue-600"
                : "text-gray-500 font-normal border-transparent hover:text-gray-700"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            <Inbox className="w-8 h-8 mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-gray-900">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Patient & Doctor
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Schedule Details
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Symptoms
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {app.patientName}
                        </p>
                        <p className="text-xs text-blue-600 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
                          Dr. {app.doctorName}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {app.appointmentDate}
                        </span>
                        <br />
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {app.appointmentTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 max-w-xs truncate">
                      {app.symptoms || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={app.appointmentStatus} />
                    </td>
                    <td className="px-5 py-3.5">
                      <PaymentPill status={app.paymentStatus} />
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

function StatusPill({ status }) {
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
  return (
    <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 whitespace-nowrap">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
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
