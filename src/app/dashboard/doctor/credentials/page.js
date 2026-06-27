"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Save,
  Award,
  Stethoscope,
  Clock,
  ShieldCheck,
  DollarSign,
  Image,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function DoctorCredentials() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    "Dermatology",
    "General Medicine",
    "Ophthalmology",
    "ENT",
    "Gynecology",
    "Psychiatry",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchProfile = () => {
    if (!session?.user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?all=true&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        const profile = data.doctors.find((d) => d.userId === session.user.id);
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
      .catch((err) => {
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
        availableDays: doctorProfile?.availableDays || [],
        availableSlots: doctorProfile?.availableSlots || [],
        verificationStatus: doctorProfile?.verificationStatus || "pending",
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`,
        },
        body: JSON.stringify(payload),
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

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-400";
  const inputBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const inputBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const inputText = theme === "dark" ? "text-white" : "text-gray-950";
  const inputPlaceholder =
    theme === "dark"
      ? "placeholder:text-slate-500"
      : "placeholder:text-gray-400";
  const labelText = theme === "dark" ? "text-slate-400" : "text-gray-400";
  const iconColor = theme === "dark" ? "text-slate-500" : "text-gray-400";
  const btnBg =
    theme === "dark"
      ? "bg-emerald-700 hover:bg-emerald-800"
      : "bg-emerald-800 hover:bg-emerald-900";
  const selectBg = theme === "dark" ? "bg-slate-800" : "bg-white";

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-4xl mx-auto space-y-6 ${bgMain} transition-colors duration-300`}
    >
      {/* Title */}
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${textPrimary} transition-colors duration-300`}
        >
          Professional Credentials Editor
        </h1>
        <p
          className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}
        >
          Configure your clinical specialities, qualifications, and billing
          options.
        </p>
      </div>

      <div
        className={`${bgCard} border ${cardBorder} rounded-2xl p-8 shadow-sm transition-colors duration-300`}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Clinical Specialties */}
            <div>
              <label
                className={`block text-xs font-semibold ${labelText} uppercase tracking-wider mb-2 flex items-center gap-1.5 transition-colors duration-300`}
              >
                <Stethoscope className={`w-3.5 h-3.5 ${iconColor}`} /> Clinical
                Specialties
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className={`w-full rounded-lg border ${inputBorder} ${selectBg} px-3.5 py-2.5 text-sm ${inputText} focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors duration-300`}
                required
              >
                {specializations.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label
                className={`block text-xs font-semibold ${labelText} uppercase tracking-wider mb-2 flex items-center gap-1.5 transition-colors duration-300`}
              >
                <Award className={`w-3.5 h-3.5 ${iconColor}`} /> Experience
                (Years)
              </label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 14"
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${inputText} ${inputPlaceholder} focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors duration-300`}
                required
              />
            </div>

            {/* Qualifications */}
            <div>
              <label
                className={`block text-xs font-semibold ${labelText} uppercase tracking-wider mb-2 flex items-center gap-1.5 transition-colors duration-300`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${iconColor}`} />{" "}
                Qualifications Statement
              </label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="e.g. MD, FACC - Harvard Medical School"
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${inputText} ${inputPlaceholder} focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors duration-300`}
                required
              />
            </div>

            {/* Consultation Fee */}
            <div>
              <label
                className={`block text-xs font-semibold ${labelText} uppercase tracking-wider mb-2 flex items-center gap-1.5 transition-colors duration-300`}
              >
                <DollarSign className={`w-3.5 h-3.5 ${iconColor}`} /> Co-Pay
                Consultation Fee ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                placeholder="e.g. 150"
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${inputText} ${inputPlaceholder} focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors duration-300`}
                required
              />
            </div>
          </div>

          {/* Hospital Name */}
          <div>
            <label
              className={`block text-xs font-semibold ${labelText} uppercase tracking-wider mb-2 flex items-center gap-1.5 transition-colors duration-300`}
            >
              <Clock className={`w-3.5 h-3.5 ${iconColor}`} /> Attached Medical
              Hospital Name
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="e.g. Boston General Hospital"
              className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${inputText} ${inputPlaceholder} focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors duration-300`}
              required
            />
          </div>

          {/* Profile Photo Image URL */}
          <div>
            <label
              className={`block text-xs font-semibold ${labelText} uppercase tracking-wider mb-2 flex items-center gap-1.5 transition-colors duration-300`}
            >
              <Image className={`w-3.5 h-3.5 ${iconColor}`} /> Profile Photo /
              Avatar Image (URL)
            </label>
            <input
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${inputText} ${inputPlaceholder} focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors duration-300`}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className={`inline-flex items-center gap-2 rounded-lg ${btnBg} text-white px-5 py-2.5 text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all focus:outline-none disabled:opacity-60`}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Professional Records
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
