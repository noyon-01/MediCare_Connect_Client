"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Users,
  Calendar,
  Star,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function DoctorOverview() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Onboarding Form States
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Availability Choices
  const dayChoices = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const slotChoices = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchProfileAndStats = () => {
    if (!session?.user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?all=true&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        const profile = data.doctors.find((d) => d.userId === session.user.id);
        if (profile) {
          setDoctorProfile(profile);
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
    fetchProfileAndStats();
  }, [session]);

  const handleOnboard = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`,
        },
        body: JSON.stringify({
          qualifications,
          experience: parseInt(experience),
          consultationFee: parseFloat(consultationFee),
          hospitalName,
          profileImage: profileImage || session.user.image,
          availableDays,
          availableSlots,
        }),
      });
      const data = await res.json();
      if (data.acknowledged) {
        toast.success(
          "Profile submitted! Awaiting administrator verification.",
        );
        fetchProfileAndStats();
      } else {
        toast.error("Profile submission failed.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const toggleDay = (day) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const toggleSlot = (slot) => {
    if (availableSlots.includes(slot)) {
      setAvailableSlots(availableSlots.filter((s) => s !== slot));
    } else {
      setAvailableSlots([...availableSlots, slot]);
    }
  };

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const cardHoverBorder =
    theme === "dark" ? "hover:border-slate-700" : "hover:border-gray-300";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const divider = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const divLight = theme === "dark" ? "border-slate-800/50" : "border-gray-100";
  const inputBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const inputBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const tagBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-gray-50 border-gray-200 text-gray-600";
  const avatarBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700"
      : "bg-gray-100 border-gray-200";
  const verificationBg =
    theme === "dark"
      ? "bg-amber-950/30 border-amber-800"
      : "bg-amber-50 border-amber-200";
  const verificationText =
    theme === "dark" ? "text-amber-400" : "text-amber-800";
  const verificationSubText =
    theme === "dark" ? "text-amber-400/70" : "text-amber-700";
  const statsIconBg = {
    blue: theme === "dark" ? "bg-blue-950/30" : "bg-blue-50",
    orange: theme === "dark" ? "bg-orange-950/30" : "bg-orange-50",
    yellow: theme === "dark" ? "bg-yellow-950/30" : "bg-yellow-50",
    green: theme === "dark" ? "bg-green-950/30" : "bg-green-50",
  };
  const statsIconColor = {
    blue: theme === "dark" ? "text-blue-400" : "text-blue-600",
    orange: theme === "dark" ? "text-orange-400" : "text-orange-600",
    yellow: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
    green: theme === "dark" ? "text-green-400" : "text-green-600",
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. Onboarding Screen if Doctor profile doesn't exist
  if (!doctorProfile) {
    return (
      <div
        className={`max-w-2xl mx-auto py-8 ${bgMain} transition-colors duration-300`}
      >
        <div
          className={`${bgCard} border ${cardBorder} rounded-xl p-8 shadow-sm transition-colors duration-300`}
        >
          <h2
            className={`text-2xl font-bold mb-2 text-center ${textPrimary} transition-colors duration-300`}
          >
            Doctor Onboarding
          </h2>
          <p
            className={`text-center text-xs ${textSecondary} mb-8 transition-colors duration-300`}
          >
            Complete your professional profile to register on MediCare Connect.
          </p>

          <form onSubmit={handleOnboard} className="space-y-6">
            <div>
              <label
                className={`block text-xs font-semibold ${textSecondary} uppercase tracking-wider mb-2 transition-colors duration-300`}
              >
                Qualifications
              </label>
              <input
                type="text"
                placeholder="e.g. MD - Cardiology, MBBS"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2.5 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-xs font-semibold ${textSecondary} uppercase tracking-wider mb-2 transition-colors duration-300`}
                >
                  Experience (Years)
                </label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2.5 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-semibold ${textSecondary} uppercase tracking-wider mb-2 transition-colors duration-300`}
                >
                  Consultation Fee ($)
                </label>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2.5 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-xs font-semibold ${textSecondary} uppercase tracking-wider mb-2 transition-colors duration-300`}
              >
                Hospital Name
              </label>
              <input
                type="text"
                placeholder="e.g. City General Hospital"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2.5 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-xs font-semibold ${textSecondary} uppercase tracking-wider mb-2 transition-colors duration-300`}
              >
                Profile Image URL
              </label>
              <input
                type="text"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2.5 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                placeholder="Leave blank to use registration photo"
              />
            </div>

            {/* Availability Selection */}
            <div>
              <label
                className={`block text-xs font-semibold ${textSecondary} uppercase tracking-wider mb-2 transition-colors duration-300`}
              >
                Select Available Days
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {dayChoices.map((day) => {
                  const selected = availableDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : `${inputBg} border ${inputBorder} ${textSecondary} hover:bg-blue-50 dark:hover:bg-blue-950/30`
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                className={`block text-xs font-semibold ${textSecondary} uppercase tracking-wider mb-2 transition-colors duration-300`}
              >
                Select Time Slots
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {slotChoices.map((slot) => {
                  const selected = availableSlots.includes(slot);
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => toggleSlot(slot)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : `${inputBg} border ${inputBorder} ${textSecondary} hover:bg-blue-50 dark:hover:bg-blue-950/30`
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              Save & Submit Profile
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Main Dashboard Overview Screen if profile is registered
  const pending = appointments.filter((a) => a.appointmentStatus === "Pending");
  const accepted = appointments.filter(
    (a) =>
      a.appointmentStatus === "Accepted" || a.appointmentStatus === "Confirmed",
  );
  const uniquePatients = new Set(appointments.map((a) => a.patientId)).size;

  return (
    <div className={`space-y-8 ${bgMain} transition-colors duration-300`}>
      {/* Title */}
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${textPrimary} transition-colors duration-300`}
        >
          Doctor Dashboard
        </h1>
        <p
          className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}
        >
          Welcome back, Dr. {session?.user?.name || "Doctor"}.
        </p>
      </div>

      {/* Verification Banner */}
      {doctorProfile.verificationStatus === "pending" && (
        <div
          className={`${verificationBg} border rounded-xl p-4 flex gap-3 transition-colors duration-300`}
        >
          <Clock
            className={`w-5 h-5 ${verificationText} flex-shrink-0 mt-0.5`}
          />
          <div>
            <h3 className={`text-sm font-semibold ${verificationText}`}>
              Awaiting Verification
            </h3>
            <p
              className={`text-xs ${verificationSubText} mt-0.5 leading-relaxed`}
            >
              Your professional profile has been submitted and is currently
              pending verification by site administrators. Once verified,
              patients will see you in search lists.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`${bgCard} border ${cardBorder} ${cardHoverBorder} rounded-xl p-5 transition-all duration-300`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-xs font-medium ${textSecondary} uppercase tracking-wide transition-colors duration-300`}
              >
                Patients Treated
              </p>
              <p
                className={`mt-2 text-2xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
              >
                {uniquePatients}
              </p>
            </div>
            <div
              className={`w-9 h-9 rounded-lg ${statsIconBg.blue} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}
            >
              <Users className={`w-4 h-4 ${statsIconColor.blue}`} />
            </div>
          </div>
        </div>
        <div
          className={`${bgCard} border ${cardBorder} ${cardHoverBorder} rounded-xl p-5 transition-all duration-300`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-xs font-medium ${textSecondary} uppercase tracking-wide transition-colors duration-300`}
              >
                Appointments
              </p>
              <p
                className={`mt-2 text-2xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
              >
                {appointments.length}
              </p>
            </div>
            <div
              className={`w-9 h-9 rounded-lg ${statsIconBg.orange} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}
            >
              <Calendar className={`w-4 h-4 ${statsIconColor.orange}`} />
            </div>
          </div>
        </div>
        <div
          className={`${bgCard} border ${cardBorder} ${cardHoverBorder} rounded-xl p-5 transition-all duration-300`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-xs font-medium ${textSecondary} uppercase tracking-wide transition-colors duration-300`}
              >
                Avg Rating
              </p>
              <p
                className={`mt-2 text-2xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
              >
                {doctorProfile.rating
                  ? Number(doctorProfile.rating).toFixed(1)
                  : "N/A"}
              </p>
            </div>
            <div
              className={`w-9 h-9 rounded-lg ${statsIconBg.yellow} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}
            >
              <Star
                className={`w-4 h-4 ${statsIconColor.yellow} fill-current`}
              />
            </div>
          </div>
        </div>
        <div
          className={`${bgCard} border ${cardBorder} ${cardHoverBorder} rounded-xl p-5 transition-all duration-300`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-xs font-medium ${textSecondary} uppercase tracking-wide transition-colors duration-300`}
              >
                Consultation Fee
              </p>
              <p
                className={`mt-2 text-2xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
              >
                ${doctorProfile.consultationFee}
              </p>
            </div>
            <div
              className={`w-9 h-9 rounded-lg ${statsIconBg.green} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}
            >
              <DollarSign className={`w-4 h-4 ${statsIconColor.green}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Profile & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`${bgCard} border ${cardBorder} rounded-xl p-6 transition-colors duration-300`}
        >
          <h2
            className={`text-base font-semibold ${textPrimary} mb-4 transition-colors duration-300`}
          >
            Profile Details
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <span
                className={`block text-xs font-medium ${textSecondary} uppercase tracking-wider transition-colors duration-300`}
              >
                Hospital
              </span>
              <p
                className={`text-sm font-semibold ${textPrimary} mt-0.5 transition-colors duration-300`}
              >
                {doctorProfile.hospitalName}
              </p>
            </div>
            <div>
              <span
                className={`block text-xs font-medium ${textSecondary} uppercase tracking-wider transition-colors duration-300`}
              >
                Qualifications
              </span>
              <p
                className={`text-sm font-semibold ${textPrimary} mt-0.5 transition-colors duration-300`}
              >
                {doctorProfile.qualifications}
              </p>
            </div>
            <div>
              <span
                className={`block text-xs font-medium ${textSecondary} uppercase tracking-wider transition-colors duration-300`}
              >
                Experience
              </span>
              <p
                className={`text-sm font-semibold ${textPrimary} mt-0.5 transition-colors duration-300`}
              >
                {doctorProfile.experience} Years
              </p>
            </div>
            <div>
              <span
                className={`block text-xs font-medium ${textSecondary} uppercase tracking-wider transition-colors duration-300`}
              >
                Available Days
              </span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {doctorProfile.availableDays.map((d) => (
                  <span
                    key={d}
                    className={`inline-flex ${tagBg} rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-300`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${bgCard} border ${cardBorder} rounded-xl lg:col-span-2 overflow-hidden transition-colors duration-300`}
        >
          <div
            className={`px-5 py-4 border-b ${divider} flex items-center justify-between transition-colors duration-300`}
          >
            <div>
              <h3
                className={`text-base font-semibold ${textPrimary} transition-colors duration-300`}
              >
                Pending Requests
              </h3>
              <p
                className={`text-xs ${textSecondary} mt-0.5 transition-colors duration-300`}
              >
                Awaiting your approval
              </p>
            </div>
            <a
              href="/dashboard/doctor/requests"
              className={`text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 transition-colors`}
            >
              All Requests <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className={`divide-y ${divLight} max-h-80 overflow-y-auto`}>
            {pending.length === 0 ? (
              <p
                className={`text-sm ${textSecondary} p-8 text-center transition-colors duration-300`}
              >
                You're all caught up. No pending requests.
              </p>
            ) : (
              pending.slice(0, 5).map((a) => (
                <div key={a._id} className="p-4 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center text-xs font-semibold flex-shrink-0 ${textMuted} transition-colors duration-300`}
                  >
                    {(a.patientName || "P")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${textPrimary} truncate transition-colors duration-300`}
                    >
                      {a.patientName}
                    </p>
                    <p
                      className={`text-xs ${textSecondary} mt-0.5 transition-colors duration-300`}
                    >
                      {a.appointmentDate} · {a.appointmentTime}
                    </p>
                  </div>
                  <a
                    href="/dashboard/doctor/requests"
                    className={`text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors`}
                  >
                    Open →
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
