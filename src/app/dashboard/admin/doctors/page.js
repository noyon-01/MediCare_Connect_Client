"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Check, X, Star } from "lucide-react";

export default function AdminDoctors() {
  const { data: session } = authClient.useSession();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchDoctors = () => {
    if (!session?.user?.id) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?all=true&limit=100`)
      .then(res => res.json())
      .then(data => {
        setDoctors(data.doctors);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, [session]);

  const updateVerification = async (id, status) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/doctors/${id}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
        },
        body: JSON.stringify({ verificationStatus: status })
      });
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
    filter === "all" ? true : (d.verificationStatus || "pending") === filter
  );

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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Doctors</h1>
        <p className="text-sm text-gray-500 mt-1">Verify doctor credentials, reject verification requests, or cancel verified status.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
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
                ? "text-gray-900 font-medium border-blue-600"
                : "text-gray-500 font-normal border-transparent hover:text-gray-700"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 text-sm">
          No doctor profiles found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((d) => (
            <div key={d._id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {d.profileImage ? (
                      <img src={d.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-semibold">
                        {(d.doctorName || "D")[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{d.doctorName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{d.hospitalName || "N/A"}</p>
                      </div>
                      <StatusPill status={d.verificationStatus} />
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[11px] text-gray-700">
                        {d.experience}+ yrs exp
                      </span>
                      <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[11px] text-gray-700">
                        ${d.consultationFee} fee
                      </span>
                      {d.rating > 0 && (
                        <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[11px] text-gray-700">
                          <Star className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
                          {Number(d.rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 truncate">{d.qualifications || "No qualifications listed"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 justify-end">
                {d.verificationStatus !== "verified" && (
                  <button
                    onClick={() => updateVerification(d._id, "verified")}
                    className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Verify
                  </button>
                )}
                {d.verificationStatus !== "rejected" && (
                  <button
                    onClick={() => updateVerification(d._id, "rejected")}
                    className="inline-flex items-center gap-1 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-red-600 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
                {d.verificationStatus === "verified" && (
                  <button
                    onClick={() => updateVerification(d._id, "pending")}
                    className="inline-flex items-center gap-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-750 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
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

function StatusPill({ status }) {
  const normalized = (status || "pending").toLowerCase();
  const map = {
    verified: { dot: "bg-green-500", label: "Verified" },
    pending: { dot: "bg-orange-500", label: "Pending" },
    rejected: { dot: "bg-red-500", label: "Rejected" },
  };
  const s = map[normalized] || { dot: "bg-gray-400", label: status };
  return (
    <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-[11px] text-gray-700 whitespace-nowrap">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
