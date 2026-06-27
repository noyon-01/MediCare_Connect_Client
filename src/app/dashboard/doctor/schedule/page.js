"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Calendar, Clock, Plus, X } from "lucide-react";

export default function DoctorSchedule() {
  const { data: session } = authClient.useSession();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable lists
  const [days, setDays] = useState([]);
  const [slots, setSlots] = useState([]);

  // Inputs for adding
  const [newDay, setNewDay] = useState("");
  const [newSlot, setNewSlot] = useState("");

  const dayChoices = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const fetchProfile = () => {
    if (!session?.user?.id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?all=true&limit=100`)
      .then(res => res.json())
      .then(data => {
        const profile = data.doctors.find(d => d.userId === session.user.id);
        if (profile) {
          setDoctorProfile(profile);
          setDays(profile.availableDays || []);
          setSlots(profile.availableSlots || []);
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

  const handleSave = async () => {
    if (!doctorProfile) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
        },
        body: JSON.stringify({
          ...doctorProfile,
          availableDays: days,
          availableSlots: slots
        })
      });
      const data = await res.json();
      if (data.acknowledged) {
        toast.success("Schedule updated successfully!");
        fetchProfile();
      } else {
        toast.error("Failed to update schedule.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const addDay = () => {
    if (!newDay) return;
    if (days.includes(newDay)) {
      toast.error("Day already added.");
      return;
    }
    setDays([...days, newDay]);
    setNewDay("");
  };

  const removeDay = (dayToRemove) => {
    setDays(days.filter(d => d !== dayToRemove));
  };

  const addSlot = () => {
    if (!newSlot) return;
    if (slots.includes(newSlot)) {
      toast.error("Time slot already added.");
      return;
    }
    setSlots([...slots, newSlot]);
    setNewSlot("");
  };

  const removeSlot = (slotToRemove) => {
    setSlots(slots.filter(s => s !== slotToRemove));
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
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm max-w-xl mx-auto">
        Please complete your onboarding profile on the Dashboard home page first.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your available consulting days and hourly slots.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Days Column */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-900">Available Days</h2>
            </div>
            
            <div className="flex gap-2 mb-6">
              <select 
                value={newDay} 
                onChange={e => setNewDay(e.target.value)} 
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a day</option>
                {dayChoices.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <button
                onClick={addDay}
                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {days.map(d => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-700 font-medium"
                >
                  {d}
                  <button
                    onClick={() => removeDay(d)}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {days.length === 0 && (
                <p className="text-xs text-gray-500 italic p-2">No available days listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Time Slots Column */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-900">Available Slots</h2>
            </div>

            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="e.g. 09:00 AM - 10:00 AM" 
                value={newSlot} 
                onChange={e => setNewSlot(e.target.value)} 
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={addSlot}
                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {slots.map(s => (
                <div
                  key={s}
                  className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-2.5"
                >
                  <span className="text-xs font-semibold text-gray-700 font-mono">{s}</span>
                  <button
                    onClick={() => removeSlot(s)}
                    className="inline-flex items-center gap-0.5 text-xs text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 px-2 py-1 rounded-md transition-all"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              ))}
              {slots.length === 0 && (
                <p className="text-xs text-gray-500 italic p-2">No time slots configured.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        Save Schedule Changes
      </button>
    </div>
  );
}
