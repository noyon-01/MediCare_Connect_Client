"use client";
import { useState, useEffect, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  ClipboardList,
  Plus,
  Edit2,
  Trash2,
  User,
  Clock,
  FileText,
} from "lucide-react";
import { useTheme } from "next-themes";

function PrescriptionContent() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();

  const [doctorProfile, setDoctorProfile] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Modal states
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [addingPrescription, setAddingPrescription] = useState(false);

  // Form states
  const [patientId, setPatientId] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPrescriptions = (profileId) => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/prescriptions?doctorId=${profileId}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setPrescriptions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?all=true&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        const profile = data.doctors.find((d) => d.userId === session.user.id);
        if (profile) {
          setDoctorProfile(profile);
          fetchPrescriptions(profile._id);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    const qPatientId = searchParams.get("patientId");
    const qAppId = searchParams.get("appointmentId");
    if (qPatientId) {
      setPatientId(qPatientId);
      setAddingPrescription(true);
    }
    if (qAppId) setAppointmentId(qAppId);
  }, [session, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorProfile) return;

    const body = {
      doctorId: doctorProfile._id,
      patientId,
      appointmentId,
      diagnosis,
      medications,
      notes,
    };

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/prescriptions`;
      let method = "POST";

      if (editingPrescription) {
        url += `/${editingPrescription._id}`;
        method = "PATCH";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.acknowledged || data.modifiedCount > 0) {
        toast.success(
          editingPrescription
            ? "Prescription updated!"
            : "Prescription created!",
        );

        setPatientId("");
        setAppointmentId("");
        setDiagnosis("");
        setMedications("");
        setNotes("");
        setEditingPrescription(null);
        setAddingPrescription(false);

        fetchPrescriptions(doctorProfile._id);
      } else {
        toast.error("Operation failed.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleEdit = (pres) => {
    setEditingPrescription(pres);
    setPatientId(pres.patientId);
    setAppointmentId(pres.appointmentId);
    setDiagnosis(pres.diagnosis);
    setMedications(pres.medications);
    setNotes(pres.notes);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (data.deletedCount > 0) {
        toast.success("Prescription deleted successfully.");
        fetchPrescriptions(doctorProfile._id);
      } else {
        toast.error("Failed to delete prescription.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

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
  const inputBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const inputBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const modalBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-gray-200";
  const overlayBg = theme === "dark" ? "bg-black/60" : "bg-black/40";
  const emptyIcon = theme === "dark" ? "text-slate-600" : "text-gray-300";
  const avatarBg = theme === "dark" ? "bg-blue-950/30" : "bg-blue-50";
  const avatarText = theme === "dark" ? "text-blue-400" : "text-blue-600";
  const tagBg = theme === "dark" ? "bg-slate-800" : "bg-gray-50";
  const tagBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const tagText = theme === "dark" ? "text-slate-300" : "text-gray-600";
  const btnHover = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-50";
  const deleteHover =
    theme === "dark"
      ? "hover:bg-red-950/30 hover:border-red-800"
      : "hover:bg-red-50 hover:border-red-200";
  const formLabel = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const errorBg =
    theme === "dark"
      ? "bg-red-950/30 border-red-800 text-red-400"
      : "bg-red-50 border-red-200 text-red-800";

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctorProfile) {
    return (
      <div
        className={`${errorBg} border rounded-xl p-4 text-sm transition-colors duration-300`}
      >
        Please complete your onboarding profile on the Dashboard home page
        first.
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${bgMain} transition-colors duration-300`}>
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${textPrimary} transition-colors duration-300`}
          >
            Prescriptions
          </h1>
          <p
            className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}
          >
            Create, review, and manage medical prescriptions for patients.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPrescription(null);
            setPatientId("");
            setAppointmentId("");
            setDiagnosis("");
            setMedications("");
            setNotes("");
            setAddingPrescription(true);
          }}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Create prescription
        </button>
      </div>

      {/* List */}
      {prescriptions.length === 0 ? (
        <div
          className={`${bgCard} border ${cardBorder} rounded-xl p-12 text-center transition-colors duration-300`}
        >
          <ClipboardList
            className={`w-8 h-8 mx-auto ${emptyIcon} mb-3 transition-colors duration-300`}
          />
          <p
            className={`text-sm font-semibold ${textPrimary} transition-colors duration-300`}
          >
            No prescriptions logged
          </p>
          <p
            className={`text-xs ${textSecondary} mt-1 transition-colors duration-300`}
          >
            Write a prescription to begin tracking patient medical care records.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptions.map((pres) => (
            <div
              key={pres._id}
              className={`${bgCard} border ${cardBorder} rounded-xl p-5 flex flex-col justify-between transition-colors duration-300`}
            >
              <div>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}
                    >
                      <User className={`w-4 h-4 ${avatarText}`} />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-medium ${textSecondary} transition-colors duration-300`}
                      >
                        Patient ID
                      </p>
                      <p
                        className={`text-sm font-semibold ${textPrimary} truncate max-w-[150px] transition-colors duration-300`}
                      >
                        {pres.patientId}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] ${textMuted} whitespace-nowrap inline-flex items-center gap-1 transition-colors duration-300`}
                  >
                    <Clock className="w-3 h-3" />
                    {new Date(pres.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-start gap-1">
                    <span
                      className={`font-semibold ${textPrimary} w-20 flex-shrink-0 transition-colors duration-300`}
                    >
                      Diagnosis:
                    </span>
                    <span
                      className={`${textBody} transition-colors duration-300`}
                    >
                      {pres.diagnosis}
                    </span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span
                      className={`font-semibold ${textPrimary} w-20 flex-shrink-0 transition-colors duration-300`}
                    >
                      Meds:
                    </span>
                    <span
                      className={`${tagBg} border ${tagBorder} rounded px-1.5 py-0.5 text-xs font-mono ${tagText} transition-colors duration-300`}
                    >
                      {pres.medications}
                    </span>
                  </div>
                  {pres.notes && (
                    <div className="flex items-start gap-1">
                      <span
                        className={`font-semibold ${textPrimary} w-20 flex-shrink-0 transition-colors duration-300`}
                      >
                        Notes:
                      </span>
                      <span
                        className={`${textBody} italic transition-colors duration-300`}
                      >
                        "{pres.notes}"
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`mt-5 pt-3 border-t ${divLight} flex items-center justify-end gap-1.5 transition-colors duration-300`}
              >
                <button
                  onClick={() => handleEdit(pres)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${cardBorder} text-xs ${textSecondary} ${btnHover} transition-colors duration-300`}
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pres._id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${cardBorder} text-xs text-red-600 dark:text-red-400 ${deleteHover} transition-colors duration-300`}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription Form Modal */}
      {(addingPrescription || editingPrescription) && (
        <div
          onClick={() => {
            setAddingPrescription(false);
            setEditingPrescription(null);
          }}
          className={`fixed inset-0 z-50 ${overlayBg} flex items-center justify-center p-4 backdrop-blur-xs`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${modalBg} border rounded-xl p-6 max-w-md w-full shadow-2xl transition-colors duration-300`}
          >
            <h3
              className={`text-base font-semibold ${textPrimary} transition-colors duration-300`}
            >
              {editingPrescription
                ? "Modify Prescription"
                : "Write Prescription"}
            </h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  className={`block text-xs font-medium ${formLabel} mb-1.5 transition-colors duration-300`}
                >
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-medium ${formLabel} mb-1.5 transition-colors duration-300`}
                >
                  Appointment ID
                </label>
                <input
                  type="text"
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-medium ${formLabel} mb-1.5 transition-colors duration-300`}
                >
                  Diagnosis
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Seasonal Flu"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-medium ${formLabel} mb-1.5 transition-colors duration-300`}
                >
                  Medications (dosage/schedule)
                </label>
                <textarea
                  placeholder="e.g. Paracetamol 500mg - Twice daily after meals"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  rows={3}
                  className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-medium ${formLabel} mb-1.5 transition-colors duration-300`}
                >
                  Additional Notes (Optional)
                </label>
                <textarea
                  placeholder="e.g. Avoid cold drinks. Complete rest."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                />
              </div>
              <div className="mt-5 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setAddingPrescription(false);
                    setEditingPrescription(null);
                  }}
                  className={`px-3 py-2 text-sm ${textSecondary} ${btnHover} rounded-lg border ${inputBorder} transition-colors duration-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DoctorPrescriptions() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[30vh]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <PrescriptionContent />
    </Suspense>
  );
}
