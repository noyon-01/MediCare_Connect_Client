"use client";
import { useState, useEffect, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ClipboardList, Plus, Edit2, Trash2, User, Clock, FileText } from "lucide-react";

function PrescriptionContent() {
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();

  const [doctorProfile, setDoctorProfile] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [addingPrescription, setAddingPrescription] = useState(false);

  // Form states
  const [patientId, setPatientId] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState("");
  const [notes, setNotes] = useState("");

  const fetchPrescriptions = (profileId) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions?doctorId=${profileId}`)
      .then(res => res.json())
      .then(data => {
        setPrescriptions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?all=true&limit=100`)
      .then(res => res.json())
      .then(data => {
        const profile = data.doctors.find(d => d.userId === session.user.id);
        if (profile) {
          setDoctorProfile(profile);
          fetchPrescriptions(profile._id);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
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
      notes
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
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (data.acknowledged || data.modifiedCount > 0) {
        toast.success(editingPrescription ? "Prescription updated!" : "Prescription created!");
        
        // Reset form
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prescriptions/${id}`, {
        method: "DELETE"
      });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctorProfile) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
        Please complete your onboarding profile on the Dashboard home page first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Prescriptions</h1>
          <p className="text-sm text-gray-500 mt-1">Create, review, and manage medical prescriptions for patients.</p>
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
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <ClipboardList className="w-8 h-8 mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-900">No prescriptions logged</p>
          <p className="text-xs text-gray-500 mt-1">
            Write a prescription to begin tracking patient medical care records.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptions.map((pres) => (
            <div key={pres._id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Patient ID</p>
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">{pres.patientId}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(pres.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-1">
                    <span className="font-semibold text-gray-900 w-20 flex-shrink-0">Diagnosis:</span>
                    <span className="text-gray-600">{pres.diagnosis}</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="font-semibold text-gray-900 w-20 flex-shrink-0">Meds:</span>
                    <span className="text-gray-600 leading-relaxed font-mono text-xs bg-gray-50 border border-gray-150 rounded px-1.5 py-0.5">{pres.medications}</span>
                  </div>
                  {pres.notes && (
                    <div className="flex items-start gap-1">
                      <span className="font-semibold text-gray-900 w-20 flex-shrink-0">Notes:</span>
                      <span className="text-gray-600 italic">"{pres.notes}"</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleEdit(pres)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pres._id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 text-xs text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
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
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-gray-200 rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-base font-semibold text-gray-900">
              {editingPrescription ? "Modify Prescription" : "Write Prescription"}
            </h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Patient ID</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Appointment ID</label>
                <input
                  type="text"
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Diagnosis</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Seasonal Flu"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Medications (dosage/schedule)</label>
                <textarea
                  placeholder="e.g. Paracetamol 500mg - Twice daily after meals"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Additional Notes (Optional)</label>
                <textarea
                  placeholder="e.g. Avoid cold drinks. Complete rest."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mt-5 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setAddingPrescription(false);
                    setEditingPrescription(null);
                  }}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
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
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PrescriptionContent />
    </Suspense>
  );
}
