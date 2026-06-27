"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, X, ClipboardList, Calendar, Clock, Inbox } from "lucide-react";
import { useTheme } from "next-themes";

export default function DoctorRequests() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchRequests = () => {
    if (!session?.user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?all=true&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        const profile = data.doctors.find((d) => d.userId === session.user.id);
        if (profile) {
          return fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/my-appointments?doctorId=${profile._id}`,
          );
        } else {
          setLoading(false);
          return null;
        }
      })
      .then((res) => (res ? res.json() : null))
      .then((data) => {
        if (data) {
          setAppointments(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, [session]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentStatus: status }),
        },
      );
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success(`Appointment marked as ${status}!`);

        if (status === "Completed") {
          const app = appointments.find((a) => a._id === id);
          router.push(
            `/dashboard/doctor/prescriptions?patientId=${app.patientId}&appointmentId=${app._id}`,
          );
        } else {
          fetchRequests();
        }
      } else {
        toast.error("Failed to update appointment status.");
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
  const emptyIcon = theme === "dark" ? "text-slate-600" : "text-gray-300";
  const avatarBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700"
      : "bg-gray-100 border-gray-200";
  const avatarText = theme === "dark" ? "text-slate-400" : "text-gray-400";
  const tagBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const symptomText = theme === "dark" ? "text-slate-300" : "text-gray-600";
  const symptomLabel = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const acceptBtn =
    theme === "dark"
      ? "bg-blue-950/30 hover:bg-blue-950/50 text-blue-400"
      : "bg-blue-50 hover:bg-blue-100 text-blue-600";
  const rejectBtn =
    theme === "dark"
      ? "bg-slate-800 hover:bg-red-950/30 border-slate-700 hover:border-red-800 text-red-400"
      : "bg-white hover:bg-red-50 border-gray-200 hover:border-red-200 text-red-600";
  const completeBtn =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";
  const prescriptionBtn =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700";
  const statusPillBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";

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
          Appointment Requests
        </h1>
        <p
          className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}
        >
          Review patient consultation queries and update their status.
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

      {/* List */}
      {filtered.length === 0 ? (
        <div
          className={`${bgCard} border ${cardBorder} rounded-xl p-12 text-center transition-colors duration-300`}
        >
          <Inbox
            className={`w-8 h-8 mx-auto ${emptyIcon} mb-3 transition-colors duration-300`}
          />
          <p
            className={`text-sm font-semibold ${textPrimary} transition-colors duration-300`}
          >
            No appointments found
          </p>
          <p
            className={`text-xs ${textSecondary} mt-1 transition-colors duration-300`}
          >
            Once patients request appointments, they will show up here.
          </p>
        </div>
      ) : (
        <div
          className={`${bgCard} border ${cardBorder} rounded-xl divide-y ${divLight} transition-colors duration-300`}
        >
          {filtered.map((a) => (
            <div key={a._id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center text-sm font-semibold flex-shrink-0 ${avatarText} transition-colors duration-300`}
                  >
                    {(a.patientName || "P")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${textPrimary} transition-colors duration-300`}
                    >
                      {a.patientName}
                    </p>
                    <p
                      className={`text-xs ${textSecondary} mt-0.5 transition-colors duration-300`}
                    >
                      {a.patientEmail || "N/A"}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
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
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  {a.appointmentStatus === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(a._id, "Accepted")}
                        className={`inline-flex items-center gap-1 ${acceptBtn} rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors`}
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => updateStatus(a._id, "Rejected")}
                        className={`inline-flex items-center gap-1 ${rejectBtn} rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors border`}
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {a.appointmentStatus === "Accepted" && (
                    <button
                      onClick={() => updateStatus(a._id, "Completed")}
                      className={`inline-flex items-center gap-1 ${completeBtn} rounded-lg px-3 py-1.5 text-xs font-medium transition-colors`}
                    >
                      Mark completed →
                    </button>
                  )}
                  {a.appointmentStatus === "Completed" && (
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/doctor/prescriptions?patientId=${a.patientId}&appointmentId=${a._id}`,
                        )
                      }
                      className={`inline-flex items-center gap-1 ${prescriptionBtn} rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors border`}
                    >
                      <ClipboardList className="w-3.5 h-3.5" /> Prescription
                    </button>
                  )}
                </div>
              </div>
              {a.symptoms && (
                <p
                  className={`mt-3 pt-3 border-t ${divLight} text-xs ${symptomText} transition-colors duration-300`}
                >
                  <span
                    className={`${symptomLabel} font-medium transition-colors duration-300`}
                  >
                    Symptoms:{" "}
                  </span>
                  {a.symptoms}
                </p>
              )}
            </div>
          ))}
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
