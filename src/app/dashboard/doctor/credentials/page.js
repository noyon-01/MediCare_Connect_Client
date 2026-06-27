"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Save, Award, Stethoscope, Clock, ShieldCheck, DollarSign, Image } from "lucide-react";

export default function DoctorCredentials() {
  const { data: session } = authClient.useSession();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields state
  const [specialization, setSpecialization] = useState("Cardiology");
  const [experience, setExperience] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const specializations = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology"
  ];

  const fetchProfile = () => {
    if (!session?.user?.id) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?all=true&limit=100`)
      .then(res => res.json())
      .then(data => {
        const profile = data.doctors.find(d => d.userId === session.user.id);
        if (profile) {
          setDoctorProfile(profile);
          setSpecialization(profile.specialization || "Cardiology");
          setExperience(profile.experience || "");
          setQualifications(profile.qualifications || "");
          setConsultationFee(profile.consultationFee || "");
          setHospitalName(profile.hospitalName || "");
          setProfileImage(profile.profileImage || "");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        specialization,
        experience: parseInt(experience) || 0,
        qualifications,
        consultationFee: parseFloat(consultationFee) || 0,
        hospitalName,
        profileImage: profileImage || session.user.image,
        // preserve schedule configurations
        availableDays: doctorProfile?.availableDays || [],
        availableSlots: doctorProfile?.availableSlots || [],
        verificationStatus: doctorProfile?.verificationStatus || "pending"
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.acknowledged) {
        toast.success("Professional records updated successfully!");
        fetchProfile();
      } else {
        toast.error("Failed to save credentials.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Professional Credentials Editor</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your clinical specialities, qualifications, and billing options.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Clinical Specialties */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-gray-400" /> Clinical Specialties
              </label>
              <select
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-950 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              >
                {specializations.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-gray-400" /> Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                placeholder="e.g. 14"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-950 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> Qualifications Statement
              </label>
              <input
                type="text"
                value={qualifications}
                onChange={e => setQualifications(e.target.value)}
                placeholder="e.g. MD, FACC - Harvard Medical School"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-950 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            {/* Consultation Fee */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-gray-400" /> Co-Pay Consultation Fee ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={consultationFee}
                onChange={e => setConsultationFee(e.target.value)}
                placeholder="e.g. 150"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-950 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          {/* Hospital Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" /> Attached Medical Hospital Name
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={e => setHospitalName(e.target.value)}
              placeholder="e.g. Boston General Hospital"
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-950 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              required
            />
          </div>

          {/* Profile Photo Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-gray-400" /> Profile Photo / Avatar Image (URL)
            </label>
            <input
              type="url"
              value={profileImage}
              onChange={e => setProfileImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-950 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all focus:outline-none disabled:opacity-60"
            >
              {saving ? <span className="loading loading-spinner loading-xs"></span> : <Save className="w-4 h-4" />}
              Save Professional Records
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
