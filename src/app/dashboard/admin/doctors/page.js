"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Check, X, Star } from "lucide-react";
import { useTheme } from "next-themes";

export default function AdminDoctors() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDoctors = () => {
    if (!session?.user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?all=true&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.doctors);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, [session]);

  const updateVerification = async (id, status) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/doctors/${id}/verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`,
          },
          body: JSON.stringify({ verificationStatus: status }),
        },
      );
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success(`Doctor status successfully set to ${status}!`);
        fetchDoctors();
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const filtered = doctors.filter((d) =>
    filter === "all" ? true : (d.verificationStatus || "pending") === filter,
  );

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const textBody = theme === "dark" ? "text-slate-300" : "text-gray-600";
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
  const emptyIcon = theme === "dark" ? "text-slate-600" : "text-gray-500";
  const avatarBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700"
      : "bg-gray-100 border-gray-200";
  const avatarText = theme === "dark" ? "text-slate-400" : "text-gray-400";
  const tagBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const verifyBtn =
    theme === "dark"
      ? "bg-blue-950/30 hover:bg-blue-950/50 text-blue-400"
      : "bg-blue-50 hover:bg-blue-100 text-blue-600";
  const rejectBtn =
    theme === "dark"
      ? "bg-slate-800 hover:bg-red-950/30 border-slate-700 hover:border-red-800 text-red-400"
      : "bg-white hover:bg-red-50 border-gray-200 hover:border-red-200 text-red-600";
  const revokeBtn =
    theme === "dark"
      ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
      : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700";
  const statusPillBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const emptyBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-gray-200";

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
          Manage Doctors
        </h1>
        <p
          className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}
        >
          Verify doctor credentials, reject verification requests, or cancel
          verified status.
        </p>
      </div>

      {/* Tabs */}
      <div
        className={`border-b ${divider} flex items-center gap-1 overflow-x-auto whitespace-nowrap transition-colors duration-300`}
      >
        {[
          ["all", "All"],
          ["pending", "Pending"],
          ["verified", "Verified"],
          ["rejected", "Rejected"],
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

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className={`${emptyBg} border rounded-xl p-12 text-center text-sm transition-colors duration-300`}
        >
          <p className={textSecondary}>No doctor profiles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((d) => (
            <div
              key={d._id}
              className={`${bgCard} border ${cardBorder} rounded-xl p-5 flex flex-col justify-between transition-colors duration-300`}
            >
              <div>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg ${avatarBg} overflow-hidden flex-shrink-0 flex items-center justify-center transition-colors duration-300`}
                  >
                    {d.profileImage ? (
                      <img
                        src={d.profileImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${avatarText} text-sm font-semibold`}
                      >
                        {(d.doctorName || "D")[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold ${textPrimary} truncate transition-colors duration-300`}
                        >
                          {d.doctorName}
                        </p>
                        <p
                          className={`text-xs ${textSecondary} mt-0.5 transition-colors duration-300`}
                        >
                          {d.hospitalName || "N/A"}
                        </p>
                      </div>
                      <StatusPill status={d.verificationStatus} theme={theme} />
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 ${tagBg} border rounded-full px-2 py-0.5 text-[11px] transition-colors duration-300`}
                      >
                        {d.experience}+ yrs exp
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 ${tagBg} border rounded-full px-2 py-0.5 text-[11px] transition-colors duration-300`}
                      >
                        ${d.consultationFee} fee
                      </span>
                      {d.rating > 0 && (
                        <span
                          className={`inline-flex items-center gap-1 ${tagBg} border rounded-full px-2 py-0.5 text-[11px] transition-colors duration-300`}
                        >
                          <Star className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
                          {Number(d.rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs ${textMuted} mt-2 truncate transition-colors duration-300`}
                    >
                      {d.qualifications || "No qualifications listed"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`mt-4 pt-4 border-t ${divLight} flex gap-2 justify-end transition-colors duration-300`}
              >
                {d.verificationStatus !== "verified" && (
                  <button
                    onClick={() => updateVerification(d._id, "verified")}
                    className={`inline-flex items-center gap-1 ${verifyBtn} rounded-lg px-3 py-1.5 text-xs font-medium transition-colors`}
                  >
                    <Check className="w-3.5 h-3.5" /> Verify
                  </button>
                )}
                {d.verificationStatus !== "rejected" && (
                  <button
                    onClick={() => updateVerification(d._id, "rejected")}
                    className={`inline-flex items-center gap-1 ${rejectBtn} rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border`}
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
                {d.verificationStatus === "verified" && (
                  <button
                    onClick={() => updateVerification(d._id, "pending")}
                    className={`inline-flex items-center gap-1 ${revokeBtn} rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border`}
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, theme }) {
  const normalized = (status || "pending").toLowerCase();
  const map = {
    verified: { dot: "bg-green-500", label: "Verified" },
    pending: { dot: "bg-orange-500", label: "Pending" },
    rejected: { dot: "bg-red-500", label: "Rejected" },
  };
  const s = map[normalized] || { dot: "bg-gray-400", label: status };
  const bg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${bg} border rounded-full px-2.5 py-0.5 text-[11px] whitespace-nowrap transition-colors duration-300`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
