// import { Star, MapPin, Briefcase } from "lucide-react";

// export default function DoctorCard({ doctor }) {
//   const rating = Number(doctor.rating || 0).toFixed(1);
//   return (
//     <a
//       href={`/doctors/${doctor._id}`}
//       className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
//     >
//       <div className="flex items-start gap-4">
//         <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
//           {doctor.profileImage ? (
//             <img
//               src={doctor.profileImage}
//               alt={doctor.doctorName}
//               className="w-full h-full object-cover"
//               referrerPolicy="no-referrer"
//               onError={(e) => {
//                 e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b' font-weight='bold'>Dr.</text></svg>";
//               }}
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold bg-gray-50">
//               {(doctor.doctorName || "D")[0]}
//             </div>
//           )}
//         </div>
//         <div className="min-w-0 flex-1">
//           <div className="flex items-start justify-between gap-2">
//             <div className="min-w-0">
//               <h3 className="text-base font-semibold text-gray-900 truncate">
//                 {doctor.doctorName}
//               </h3>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {doctor.specialization}
//               </p>
//             </div>
//             <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[11px] font-medium text-gray-700 whitespace-nowrap">
//               <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
//               {rating}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4 grid grid-cols-2 gap-2">
//         <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-[11px] text-gray-700">
//           <Briefcase className="w-3 h-3 text-gray-400" />
//           {doctor.experience}+ yrs
//         </div>
//         <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-[11px] text-gray-700 truncate">
//           <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
//           <span className="truncate">{doctor.hospitalName || "—"}</span>
//         </div>
//       </div>

//       <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
//         <div>
//           <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
//             Consultation
//           </p>
//           <p className="text-base font-semibold text-gray-900">
//             ${Number(doctor.consultationFee).toFixed(0)}
//           </p>
//         </div>
//         <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 rounded-full px-3 py-1.5 text-xs font-medium group-hover:bg-blue-100 transition-colors">
//           Book →
//         </span>
//       </div>
//     </a>
//   );
// }










"use client";
import { Star, MapPin, Briefcase, Calendar, Clock, ChevronRight, User, Award, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function DoctorCard({ doctor, index = 0 }) {
  const rating = Number(doctor.rating || 0).toFixed(1);
  const isAvailable = Math.random() > 0.3; // ডেমো জন্য, আপনি আসল ডেটা ব্যবহার করতে পারেন

  // রেটিং অনুযায়ী কালার
  const getRatingColor = (rating) => {
    const num = parseFloat(rating);
    if (num >= 4.5) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (num >= 4.0) return "text-blue-600 bg-blue-50 border-blue-200";
    if (num >= 3.5) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  // অভিজ্ঞতা অনুযায়ী লেভেল
  const getExperienceLevel = (years) => {
    if (years >= 20) return { label: "Expert", icon: Award, color: "text-purple-600 bg-purple-50" };
    if (years >= 10) return { label: "Senior", icon: Shield, color: "text-blue-600 bg-blue-50" };
    return { label: "Practitioner", icon: User, color: "text-emerald-600 bg-emerald-50" };
  };

  const expLevel = getExperienceLevel(doctor.experience || 0);
  const ExpIcon = expLevel.icon;

  return (
    <motion.a
      href={`/doctors/${doctor._id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group block relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200"
    >
      {/* Decorative Gradient Top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-5">
        {/* Header - Doctor Info */}
        <div className="flex items-start gap-4">
          {/* Avatar with Status */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-200 group-hover:border-blue-400 transition-colors duration-300">
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={doctor.doctorName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b' font-weight='bold'>Dr.</text></svg>";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl bg-gradient-to-br from-blue-50 to-purple-50">
                  {(doctor.doctorName || "D")[0]}
                </div>
              )}
            </div>
            {/* Online Status */}
            {isAvailable && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                  {doctor.doctorName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {doctor.specialization}
                </p>
              </div>
              {/* Rating Badge */}
              <span className={`inline-flex items-center gap-1 border rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${getRatingColor(rating)}`}>
                <Star className="w-3 h-3 fill-current" />
                {rating}
              </span>
            </div>

            {/* Experience Level Badge */}
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${expLevel.color}`}>
              <ExpIcon className="w-3 h-3" />
              {expLevel.label} · {doctor.experience || 0}+ yrs
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-600">
            <Briefcase className="w-3 h-3 text-slate-400" />
            {doctor.experience || 0} Years
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-600 truncate max-w-[180px]">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{doctor.hospitalName || "Not specified"}</span>
          </span>
          {isAvailable && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 text-xs text-emerald-700">
              <Clock className="w-3 h-3" />
              Available Today
            </span>
          )}
        </div>

        {/* Bottom - Fee & Action */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Consultation Fee
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-lg font-bold text-slate-900">
                ${Number(doctor.consultationFee || 0).toFixed(0)}
              </p>
              <span className="text-[10px] text-slate-400 line-through">
                ${(Number(doctor.consultationFee || 0) * 1.2).toFixed(0)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 rounded-full px-4 py-2 text-xs font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-200">
              <Calendar className="w-3.5 h-3.5" />
              Book
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* Hover Overlay Glow */}
        <div className="absolute -inset-full -z-10 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
      </div>

      {/* Rating Stars Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(parseFloat(rating) / 5) * 100}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 ${
            parseFloat(rating) >= 4.5 ? "from-emerald-400 to-emerald-500" : ""
          }`}
        />
      </div>
    </motion.a>
  );
}