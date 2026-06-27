"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Users, Calendar, Star, DollarSign, ArrowRight, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export default function DoctorOverview() {
  const { data: session } = authClient.useSession();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Onboarding Form States
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Availability Choices
  const dayChoices = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const slotChoices = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM"
  ];

  const fetchProfileAndStats = () => {
    if (!session?.user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?all=true&limit=100`)
      .then(res => res.json())
      .then(data => {
        const profile = data.doctors.find(d => d.userId === session.user.id);
        if (profile) {
          setDoctorProfile(profile);
          return fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-appointments?doctorId=${profile._id}`);
        } else {
          setLoading(false);
          return null;
        }
      })
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data) {
          setAppointments(data);
          setLoading(false);
        }
      })
      .catch(err => {
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
          "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
        },
        body: JSON.stringify({
          qualifications,
          experience: parseInt(experience),
          consultationFee: parseFloat(consultationFee),
          hospitalName,
          profileImage: profileImage || session.user.image,
          availableDays,
          availableSlots
        })
      });
      const data = await res.json();
      if (data.acknowledged) {
        toast.success("Profile submitted! Awaiting administrator verification.");
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
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const toggleSlot = (slot) => {
    if (availableSlots.includes(slot)) {
      setAvailableSlots(availableSlots.filter(s => s !== slot));
    } else {
      setAvailableSlots([...availableSlots, slot]);
    }
  };

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
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">Doctor Onboarding</h2>
          <p className="text-center text-xs text-gray-500 mb-8">Complete your professional profile to register on MediCare Connect.</p>
          
          <form onSubmit={handleOnboard} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Qualifications</label>
              <input 
                type="text" 
                placeholder="e.g. MD - Cardiology, MBBS" 
                value={qualifications} 
                onChange={e => setQualifications(e.target.value)} 
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Experience (Years)</label>
                <input 
                  type="number" 
                  value={experience} 
                  onChange={e => setExperience(e.target.value)} 
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Consultation Fee ($)</label>
                <input 
                  type="number" 
                  value={consultationFee} 
                  onChange={e => setConsultationFee(e.target.value)} 
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hospital Name</label>
              <input 
                type="text" 
                placeholder="e.g. City General Hospital" 
                value={hospitalName} 
                onChange={e => setHospitalName(e.target.value)} 
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Profile Image URL</label>
              <input 
                type="text" 
                value={profileImage} 
                onChange={e => setProfileImage(e.target.value)} 
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                placeholder="Leave blank to use registration photo"
              />
            </div>

            {/* Availability Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Available Days</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {dayChoices.map(day => {
                  const selected = availableDays.includes(day);
                  return (
                    <button 
                      type="button" 
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Time Slots</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {slotChoices.map(slot => {
                  const selected = availableSlots.includes(slot);
                  return (
                    <button 
                      type="button" 
                      key={slot}
                      onClick={() => toggleSlot(slot)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
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
  const pending = appointments.filter(a => a.appointmentStatus === "Pending");
  const accepted = appointments.filter(a => a.appointmentStatus === "Accepted" || a.appointmentStatus === "Confirmed");
  const uniquePatients = new Set(appointments.map(a => a.patientId)).size;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Doctor Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Dr. {session?.user?.name || "Doctor"}.</p>
      </div>

      {/* Verification Banner */}
      {doctorProfile.verificationStatus === "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800">Awaiting Verification</h3>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Your professional profile has been submitted and is currently pending verification by site administrators. Once verified, patients will see you in search lists.
            </p>
          </div>
        </div>
      )}



      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Patients Treated</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{uniquePatients}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Appointments</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{appointments.length}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg Rating</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{doctorProfile.rating ? Number(doctorProfile.rating).toFixed(1) : "N/A"}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Consultation Fee</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">${doctorProfile.consultationFee}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Profile Details</h2>
          <div className="space-y-4 text-sm">
            <div>
              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</span>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{doctorProfile.hospitalName}</p>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</span>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{doctorProfile.qualifications}</p>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</span>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{doctorProfile.experience} Years</p>
            </div>
            <div>
              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Available Days</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {doctorProfile.availableDays.map(d => (
                  <span key={d} className="inline-flex bg-gray-50 border border-gray-200 rounded-full px-2.5 py-0.5 text-xs text-gray-600 font-medium">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl lg:col-span-2 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Pending Requests</h3>
              <p className="text-xs text-gray-500 mt-0.5">Awaiting your approval</p>
            </div>
            <a
              href="/dashboard/doctor/requests"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
            >
              All Requests <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {pending.length === 0 ? (
              <p className="text-sm text-gray-500 p-8 text-center">
                You're all caught up. No pending requests.
              </p>
            ) : (
              pending.slice(0, 5).map((a) => (
                <div key={a._id} className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-semibold flex-shrink-0">
                    {(a.patientName || "P")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {a.patientName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {a.appointmentDate} · {a.appointmentTime}
                    </p>
                  </div>
                  <a
                    href="/dashboard/doctor/requests"
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
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
