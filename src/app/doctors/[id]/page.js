// "use client";
// import { useState, useEffect, useMemo } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import {
//   Star,
//   MapPin,
//   Briefcase,
//   Calendar,
//   Clock,
//   ArrowLeft,
//   CheckCircle2,
//   GraduationCap,
//   ShieldCheck,
//   Activity
// } from "lucide-react";

// function BookingForm({ doctor, session }) {
//   const router = useRouter();
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [symptoms, setSymptoms] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Compute next 3 weeks of allowed dates based on doctor's availableDays
//   const nextDates = useMemo(() => {
//     const out = [];
//     const dayMap = { 
//       Sunday: 0, Mon: 1, Monday: 1, Tue: 2, Tuesday: 2, 
//       Wed: 3, Wednesday: 3, Thu: 4, Thursday: 4, 
//       Fri: 5, Friday: 5, Sat: 6, Saturday: 6 
//     };
//     const dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//     const allowed = (doctor.availableDays || []).map((d) => dayMap[d]);
//     const now = new Date();
    
//     for (let i = 0; i < 21 && out.length < 7; i++) {
//       const d = new Date(now);
//       d.setDate(now.getDate() + i);
//       if (allowed.length === 0 || allowed.includes(d.getDay())) {
//         out.push({
//           iso: d.toISOString().slice(0, 10),
//           dow: dayShort[d.getDay()],
//           day: d.getDate(),
//           month: d.toLocaleDateString("en-US", { month: "short" }),
//           fullName: Object.keys(dayMap).find(k => dayMap[k] === d.getDay() && k.length > 3) || dayShort[d.getDay()]
//         });
//       }
//     }
//     return out;
//   }, [doctor]);

//   const isNotPatient = session && session.user.role !== "patient";

//   if (isNotPatient) {
//     const roleLabel = session.user.role === "doctor" ? "Doctor" : "Administrator";
//     return (
//       <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
//         <div>
//           <h3 className="text-base font-semibold text-gray-900">Appointment Bookings</h3>
//           <p className="text-xs text-gray-500 mt-1">Bookings are reserved for patients only.</p>
//         </div>
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
//           <p className="font-semibold mb-1">Authenticated as {roleLabel}</p>
//           Only patients can schedule consultations and pay fees. To schedule an appointment, please log out and sign in using a Patient account.
//         </div>
//       </div>
//     );
//   }

//   const handleBook = async (e) => {
//     e.preventDefault();

//     if (!session) {
//       toast.error("Please log in to book an appointment.");
//       router.push("/login");
//       return;
//     }

//     if (session.user.role !== "patient") {
//       toast.error("Only patients can book appointments.");
//       return;
//     }

//     if (!selectedDate || !selectedTime) {
//       toast.error("Please select a date and time slot.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Find full day name matching selected date
//       const matchDate = nextDates.find(d => d.iso === selectedDate);
//       const dayStr = matchDate ? `${matchDate.fullName} (${selectedDate})` : selectedDate;

//       // 1. Create checkout session
//       const resSession = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           patientId: session.user.id,
//           patientName: session.user.name,
//           patientEmail: session.user.email,
//           doctorId: doctor._id,
//           doctorName: doctor.doctorName,
//           appointmentDate: dayStr,
//           appointmentTime: selectedTime,
//           symptoms: symptoms,
//           amount: doctor.consultationFee,
//         }),
//       });
//       const dataSession = await resSession.json();
      
//       if (dataSession.error) {
//         throw new Error(dataSession.error);
//       }

//       // 2. Redirect browser directly to Stripe hosted Checkout
//       if (dataSession.url) {
//         window.location.href = dataSession.url;
//       } else {
//         throw new Error("Failed to generate payment checkout URL.");
//       }
//     } catch (err) {
//       toast.error(err.message || "An error occurred during booking redirect.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const availableSlots = doctor.availableSlots || [];

//   return (
//     <form onSubmit={handleBook} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
//       <div>
//         <h3 className="text-base font-semibold text-gray-900">Book an appointment</h3>
//         <p className="text-xs text-gray-500 mt-1">Pay securely with Stripe Checkout to confirm.</p>
//       </div>

//       <div>
//         <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
//           <Calendar className="w-3.5 h-3.5" /> Pick a Date
//         </label>
//         <div className="flex gap-1.5 overflow-x-auto pb-1">
//           {nextDates.map((d) => (
//             <button
//               type="button"
//               key={d.iso}
//               onClick={() => setSelectedDate(d.iso)}
//               className={`flex-shrink-0 w-14 py-2 rounded-lg border text-center transition-colors ${
//                 selectedDate === d.iso
//                   ? "border-blue-600 bg-blue-50"
//                   : "border-gray-200 bg-white hover:border-gray-300"
//               }`}
//             >
//               <p className="text-[10px] text-gray-500 font-medium uppercase">{d.dow}</p>
//               <p className="text-base font-semibold text-gray-900 my-0.5">{d.day}</p>
//               <p className="text-[10px] text-gray-500">{d.month}</p>
//             </button>
//           ))}
//         </div>
//       </div>

//       <div>
//         <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
//           <Clock className="w-3.5 h-3.5" /> Pick a Time Slot
//         </label>
//         <div className="grid grid-cols-2 gap-1.5">
//           {availableSlots.map((s) => (
//             <button
//               type="button"
//               key={s}
//               onClick={() => setSelectedTime(s)}
//               className={`py-2 rounded-lg text-xs font-medium border text-center transition-colors ${
//                 selectedTime === s
//                   ? "border-blue-600 bg-blue-50 text-blue-600"
//                   : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div>
//         <label className="block text-xs font-medium text-gray-500 mb-1.5">Symptoms</label>
//         <textarea
//           value={symptoms}
//           onChange={(e) => setSymptoms(e.target.value)}
//           rows={3}
//           placeholder="Briefly describe how you are feeling..."
//           className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
//           required
//         />
//       </div>

//       <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
//         <div>
//           <p className="text-xs text-gray-500">Consultation Fee</p>
//           <p className="text-xl font-semibold text-gray-900">${doctor.consultationFee}</p>
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-5 py-2.5 disabled:opacity-60 flex items-center gap-1.5"
//         >
//           {loading ? <span className="loading loading-spinner loading-xs"></span> : null}
//           {loading ? "Redirecting..." : "Book & Pay"}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default function DoctorDetails() {
//   const { id } = useParams();
//   const [doctor, setDoctor] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const { data: session } = authClient.useSession();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
    
//     // Fetch doctor profile
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         setDoctor(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setLoading(false);
//       });

//     // Fetch doctor reviews
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?doctorId=${id}`)
//       .then(res => res.json())
//       .then(data => setReviews(data))
//       .catch(console.error);
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[50vh]">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//       </div>
//     );
//   }

//   if (!doctor) {
//     return (
//       <div className="container mx-auto px-4 py-20 text-center">
//         <h2 className="text-2xl font-bold text-gray-900">Doctor Profile Not Found</h2>
//         <a href="/doctors" className="text-blue-600 text-sm mt-4 inline-block">← Back to doctors</a>
//       </div>
//     );
//   }

//   const rating = Number(doctor.rating || 0).toFixed(1);

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="border-b border-gray-200 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <a
//             href="/doctors"
//             className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
//           >
//             <ArrowLeft className="w-3 h-3" /> All doctors
//           </a>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Left Column: Doctor Profile */}
//           <div className="lg:col-span-2 space-y-6">
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white border border-gray-200 rounded-xl p-6"
//             >
//               <div className="flex flex-col sm:flex-row gap-6">
//                 <div className="w-28 h-28 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
//                   {doctor.profileImage ? (
//                     <img
//                       src={doctor.profileImage}
//                       alt={doctor.doctorName}
//                       className="w-full h-full object-cover"
//                       referrerPolicy="no-referrer"
//                       onError={(e) => {
//                         e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b' font-weight='bold'>Dr.</text></svg>";
//                       }}
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-semibold bg-gray-50">
//                       {doctor.doctorName ? doctor.doctorName[0] : "D"}
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex flex-wrap items-start justify-between gap-2">
//                     <div>
//                       <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
//                         {doctor.doctorName}
//                       </h1>
//                       <p className="text-sm text-gray-500 mt-0.5">
//                         {doctor.specialization}
//                       </p>
//                     </div>
//                     {doctor.verificationStatus === "verified" && (
//                       <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700">
//                         <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
//                         Verified Partner
//                       </span>
//                     )}
//                   </div>

//                   <div className="mt-4 flex flex-wrap gap-1.5">
//                     <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700">
//                       <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
//                       {rating} ({reviews.length} reviews)
//                     </span>
//                     <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700">
//                       <Briefcase className="w-3.5 h-3.5 text-gray-400" />
//                       {doctor.experience}+ years exp
//                     </span>
//                     <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700">
//                       <MapPin className="w-3.5 h-3.5 text-gray-400" />
//                       {doctor.hospitalName || "—"}
//                     </span>
//                     <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 rounded-full px-2.5 py-1 text-xs font-medium">
//                       ${doctor.consultationFee} Fee
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {doctor.qualifications && (
//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
//                     <GraduationCap className="w-4 h-4 text-gray-400" />
//                     Qualifications & Background
//                   </h3>
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     {doctor.qualifications}
//                   </p>
//                 </div>
//               )}

//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
//                   <Activity className="w-4 h-4 text-gray-400" />
//                   Weekly Availability Info
//                 </h3>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1.5">Working Days</p>
//                     <div className="flex flex-wrap gap-1">
//                       {(doctor.availableDays || []).map((d) => (
//                         <span
//                           key={d}
//                           className="bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-[11px] text-gray-700"
//                         >
//                           {d}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1.5">Available Slots</p>
//                     <div className="flex flex-wrap gap-1">
//                       {(doctor.availableSlots || []).map((s) => (
//                         <span
//                           key={s}
//                           className="bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-[11px] text-gray-700"
//                         >
//                           {s}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Patient Reviews list */}
//             <div className="bg-white border border-gray-200 rounded-xl p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-base font-semibold text-gray-900">Patient reviews</h3>
//                 <span className="text-xs text-gray-500">{reviews.length} total</span>
//               </div>
//               {reviews.length === 0 ? (
//                 <p className="text-sm text-gray-500 py-6 text-center italic">
//                   No reviews yet for this doctor. Be the first to leave feedback after booking!
//                 </p>
//               ) : (
//                 <div className="space-y-4">
//                   {reviews.map((r) => (
//                     <div
//                       key={r._id}
//                       className="pb-4 border-b border-gray-200 last:border-0 last:pb-0"
//                     >
//                       <div className="flex items-center justify-between gap-3 mb-1.5">
//                         <div className="flex items-center gap-2">
//                           <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">
//                             {(r.patientName || "U")[0].toUpperCase()}
//                           </div>
//                           <div>
//                             <p className="text-xs font-semibold text-gray-900">
//                               {r.patientName || "Anonymous Patient"}
//                             </p>
//                             <p className="text-[10px] text-gray-500">
//                               {new Date(r.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="inline-flex items-center gap-0.5">
//                           {Array.from({ length: 5 }).map((_, idx) => (
//                             <Star
//                               key={idx}
//                               className={`w-3.5 h-3.5 ${
//                                 idx < r.rating
//                                   ? "text-orange-500 fill-orange-500"
//                                   : "text-gray-200"
//                               }`}
//                             />
//                           ))}
//                         </div>
//                       </div>
//                       <p className="text-sm text-gray-600 leading-relaxed mt-2 pl-9">
//                         "{r.reviewText}"
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//             {/* Right Column: Stripe Checkout sidebar */}
//             <div className="lg:col-span-1">
//               <div className="lg:sticky lg:top-20">
//                 <BookingForm doctor={doctor} session={session} />
//               </div>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import {
  Star,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Activity
} from "lucide-react";

function BookingForm({ doctor, session }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute next 3 weeks of allowed dates based on doctor's availableDays
  const nextDates = useMemo(() => {
    const out = [];
    const dayMap = { 
      Sunday: 0, Mon: 1, Monday: 1, Tue: 2, Tuesday: 2, 
      Wed: 3, Wednesday: 3, Thu: 4, Thursday: 4, 
      Fri: 5, Friday: 5, Sat: 6, Saturday: 6 
    };
    const dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const allowed = (doctor.availableDays || []).map((d) => dayMap[d]);
    const now = new Date();
    
    for (let i = 0; i < 21 && out.length < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      if (allowed.length === 0 || allowed.includes(d.getDay())) {
        out.push({
          iso: d.toISOString().slice(0, 10),
          dow: dayShort[d.getDay()],
          day: d.getDate(),
          month: d.toLocaleDateString("en-US", { month: "short" }),
          fullName: Object.keys(dayMap).find(k => dayMap[k] === d.getDay() && k.length > 3) || dayShort[d.getDay()]
        });
      }
    }
    return out;
  }, [doctor]);

  // Theme based classes
  const cardBg = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const inputBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const inputBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const btnBg = theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700";
  const divider = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const roleBg = theme === "dark" ? "bg-blue-950/30 border-blue-800 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-800";

  const isNotPatient = session && session.user.role !== "patient";

  if (isNotPatient) {
    const roleLabel = session.user.role === "doctor" ? "Doctor" : "Administrator";
    return (
      <div className={`${cardBg} border ${cardBorder} rounded-xl p-6 space-y-4 transition-colors duration-300`}>
        <div>
          <h3 className={`text-base font-semibold ${textPrimary}`}>Appointment Bookings</h3>
          <p className={`text-xs ${textSecondary} mt-1`}>Bookings are reserved for patients only.</p>
        </div>
        <div className={`${roleBg} border rounded-xl p-4 text-xs leading-relaxed transition-colors duration-300`}>
          <p className="font-semibold mb-1">Authenticated as {roleLabel}</p>
          Only patients can schedule consultations and pay fees. To schedule an appointment, please log out and sign in using a Patient account.
        </div>
      </div>
    );
  }

  const handleBook = async (e) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please log in to book an appointment.");
      router.push("/login");
      return;
    }

    if (session.user.role !== "patient") {
      toast.error("Only patients can book appointments.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time slot.");
      return;
    }

    setLoading(true);

    try {
      const matchDate = nextDates.find(d => d.iso === selectedDate);
      const dayStr = matchDate ? `${matchDate.fullName} (${selectedDate})` : selectedDate;

      const resSession = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: session.user.id,
          patientName: session.user.name,
          patientEmail: session.user.email,
          doctorId: doctor._id,
          doctorName: doctor.doctorName,
          appointmentDate: dayStr,
          appointmentTime: selectedTime,
          symptoms: symptoms,
          amount: doctor.consultationFee,
        }),
      });
      const dataSession = await resSession.json();
      
      if (dataSession.error) {
        throw new Error(dataSession.error);
      }

      if (dataSession.url) {
        window.location.href = dataSession.url;
      } else {
        throw new Error("Failed to generate payment checkout URL.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred during booking redirect.");
    } finally {
      setLoading(false);
    }
  };

  const availableSlots = doctor.availableSlots || [];

  if (!mounted) return null;

  return (
    <form onSubmit={handleBook} className={`${cardBg} border ${cardBorder} rounded-xl p-6 space-y-5 transition-colors duration-300`}>
      <div>
        <h3 className={`text-base font-semibold ${textPrimary}`}>Book an appointment</h3>
        <p className={`text-xs ${textSecondary} mt-1`}>Pay securely with Stripe Checkout to confirm.</p>
      </div>

      <div>
        <label className={`block text-xs font-medium ${textSecondary} mb-2 flex items-center gap-1`}>
          <Calendar className="w-3.5 h-3.5" /> Pick a Date
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {nextDates.map((d) => (
            <button
              type="button"
              key={d.iso}
              onClick={() => setSelectedDate(d.iso)}
              className={`flex-shrink-0 w-14 py-2 rounded-lg border text-center transition-colors ${
                selectedDate === d.iso
                  ? theme === "dark" 
                    ? "border-blue-600 bg-blue-950/30" 
                    : "border-blue-600 bg-blue-50"
                  : theme === "dark"
                    ? "border-slate-700 bg-slate-800 hover:border-slate-600"
                    : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className={`text-[10px] font-medium uppercase ${textMuted}`}>{d.dow}</p>
              <p className={`text-base font-semibold ${textPrimary} my-0.5`}>{d.day}</p>
              <p className={`text-[10px] ${textMuted}`}>{d.month}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`block text-xs font-medium ${textSecondary} mb-2 flex items-center gap-1`}>
          <Clock className="w-3.5 h-3.5" /> Pick a Time Slot
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {availableSlots.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSelectedTime(s)}
              className={`py-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                selectedTime === s
                  ? theme === "dark"
                    ? "border-blue-600 bg-blue-950/30 text-blue-400"
                    : "border-blue-600 bg-blue-50 text-blue-600"
                  : theme === "dark"
                    ? "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={`block text-xs font-medium ${textSecondary} mb-1.5`}>Symptoms</label>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={3}
          placeholder="Briefly describe how you are feeling..."
          className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors duration-300`}
          required
        />
      </div>

      <div className={`pt-4 border-t ${divider} flex items-center justify-between`}>
        <div>
          <p className={`text-xs ${textSecondary}`}>Consultation Fee</p>
          <p className={`text-xl font-semibold ${textPrimary}`}>${doctor.consultationFee}</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`rounded-lg ${btnBg} transition-colors text-white text-sm font-medium px-5 py-2.5 disabled:opacity-60 flex items-center gap-1.5`}
        >
          {loading ? <span className="loading loading-spinner loading-xs"></span> : null}
          {loading ? "Redirecting..." : "Book & Pay"}
        </button>
      </div>
    </form>
  );
}

export default function DoctorDetails() {
  const { id } = useParams();
  const { theme } = useTheme();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!id) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`)
      .then(res => res.json())
      .then(data => {
        setDoctor(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?doctorId=${id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(console.error);
  }, [id]);

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgHeader = theme === "dark" ? "bg-slate-900" : "bg-gray-50";
  const borderColor = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const cardBg = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const tagBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const tagBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const tagText = theme === "dark" ? "text-slate-300" : "text-gray-700";
  const avatarBg = theme === "dark" ? "bg-slate-800" : "bg-gray-100";
  const avatarBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const divider = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const reviewBg = theme === "dark" ? "bg-slate-800/50" : "bg-gray-50";
  const verifiedBg = theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-gray-200 text-gray-700";

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-[50vh] ${bgMain}`}>
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className={`container mx-auto px-4 py-20 text-center ${bgMain}`}>
        <h2 className={`text-2xl font-bold ${textPrimary}`}>Doctor Profile Not Found</h2>
        <a href="/doctors" className="text-blue-600 text-sm mt-4 inline-block">← Back to doctors</a>
      </div>
    );
  }

  const rating = Number(doctor.rating || 0).toFixed(1);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen ${bgMain} transition-colors duration-300`}>
      {/* Header */}
      <div className={`border-b ${borderColor} ${bgHeader} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a
            href="/doctors"
            className={`inline-flex items-center gap-1 text-xs ${textSecondary} hover:${textPrimary} transition-colors`}
          >
            <ArrowLeft className="w-3 h-3" /> All doctors
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Doctor Profile */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${cardBg} border ${cardBorder} rounded-xl p-6 transition-colors duration-300`}
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className={`w-28 h-28 rounded-xl ${avatarBg} border ${avatarBorder} overflow-hidden flex-shrink-0 transition-colors duration-300`}>
                  {doctor.profileImage ? (
                    <img
                      src={doctor.profileImage}
                      alt={doctor.doctorName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b' font-weight='bold'>Dr.</text></svg>";
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${textMuted} text-3xl font-semibold ${avatarBg}`}>
                      {doctor.doctorName ? doctor.doctorName[0] : "D"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h1 className={`text-2xl font-semibold tracking-tight ${textPrimary}`}>
                        {doctor.doctorName}
                      </h1>
                      <p className={`text-sm ${textSecondary} mt-0.5`}>
                        {doctor.specialization}
                      </p>
                    </div>
                    {doctor.verificationStatus === "verified" && (
                      <span className={`inline-flex items-center gap-1 ${verifiedBg} border rounded-full px-2.5 py-1 text-xs transition-colors duration-300`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-blue-50 dark:fill-blue-950/30" />
                        Verified Partner
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className={`inline-flex items-center gap-1 ${tagBg} border ${tagBorder} rounded-full px-2.5 py-1 text-xs ${tagText} transition-colors duration-300`}>
                      <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      {rating} ({reviews.length} reviews)
                    </span>
                    <span className={`inline-flex items-center gap-1 ${tagBg} border ${tagBorder} rounded-full px-2.5 py-1 text-xs ${tagText} transition-colors duration-300`}>
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {doctor.experience}+ years exp
                    </span>
                    <span className={`inline-flex items-center gap-1 ${tagBg} border ${tagBorder} rounded-full px-2.5 py-1 text-xs ${tagText} transition-colors duration-300`}>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {doctor.hospitalName || "—"}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-300">
                      ${doctor.consultationFee} Fee
                    </span>
                  </div>
                </div>
              </div>

              {doctor.qualifications && (
                <div className={`mt-6 pt-6 border-t ${divider}`}>
                  <h3 className={`text-sm font-semibold ${textPrimary} mb-2 flex items-center gap-1.5`}>
                    <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    Qualifications & Background
                  </h3>
                  <p className={`text-sm ${textSecondary} leading-relaxed`}>
                    {doctor.qualifications}
                  </p>
                </div>
              )}

              <div className={`mt-6 pt-6 border-t ${divider}`}>
                <h3 className={`text-sm font-semibold ${textPrimary} mb-3 flex items-center gap-1.5`}>
                  <Activity className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  Weekly Availability Info
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={`text-xs ${textSecondary} mb-1.5`}>Working Days</p>
                    <div className="flex flex-wrap gap-1">
                      {(doctor.availableDays || []).map((d) => (
                        <span
                          key={d}
                          className={`${tagBg} border ${tagBorder} rounded-full px-2.5 py-0.5 text-[11px] ${tagText} transition-colors duration-300`}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs ${textSecondary} mb-1.5`}>Available Slots</p>
                    <div className="flex flex-wrap gap-1">
                      {(doctor.availableSlots || []).map((s) => (
                        <span
                          key={s}
                          className={`${tagBg} border ${tagBorder} rounded-full px-2.5 py-0.5 text-[11px] ${tagText} transition-colors duration-300`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Patient Reviews list */}
            <div className={`${cardBg} border ${cardBorder} rounded-xl p-6 transition-colors duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-base font-semibold ${textPrimary}`}>Patient reviews</h3>
                <span className={`text-xs ${textSecondary}`}>{reviews.length} total</span>
              </div>
              {reviews.length === 0 ? (
                <p className={`text-sm ${textSecondary} py-6 text-center italic`}>
                  No reviews yet for this doctor. Be the first to leave feedback after booking!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div
                      key={r._id}
                      className={`pb-4 ${divider} last:border-0 last:pb-0 transition-colors duration-300`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center">
                            {(r.patientName || "U")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className={`text-xs font-semibold ${textPrimary}`}>
                              {r.patientName || "Anonymous Patient"}
                            </p>
                            <p className={`text-[10px] ${textSecondary}`}>
                              {new Date(r.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3.5 h-3.5 ${
                                idx < r.rating
                                  ? "text-orange-500 fill-orange-500"
                                  : "text-slate-200 dark:text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className={`text-sm ${textSecondary} leading-relaxed mt-2 pl-9`}>
                        "{r.reviewText}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <BookingForm doctor={doctor} session={session} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}