// "use client";
// import { useState, useEffect } from "react";
// import { authClient } from "@/lib/auth-client";
// import {
//   Calendar,
//   History,
//   CreditCard,
//   Heart,
//   ArrowRight,
//   Stethoscope,
// } from "lucide-react";

// export default function PatientOverview() {
//   const { data: session } = authClient.useSession();
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!session?.user?.id) return;

//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-appointments?patientId=${session.user.id}`)
//       .then(res => res.json())
//       .then(data => {
//         setAppointments(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, [session]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[30vh]">
//         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   const upcoming = appointments.filter(a => a.appointmentStatus !== "Completed" && a.appointmentStatus !== "Cancelled" && a.appointmentStatus !== "Rejected");
//   const history = appointments.filter(a => a.appointmentStatus === "Completed");
//   const totalPaid = appointments.reduce((sum, a) => sum + (a.paymentStatus === "Paid" ? parseFloat(a.amount || 0) : 0), 0);

//   const stats = [
//     { label: "Upcoming Consultations", value: upcoming.length, icon: Calendar, bg: "bg-blue-50", text: "text-blue-600" },
//     { label: "Completed Visits", value: history.length, icon: History, bg: "bg-orange-50", text: "text-orange-600" },
//     { label: "Total Paid", value: `$${totalPaid}`, icon: CreditCard, bg: "bg-green-50", text: "text-green-600" },
//     { label: "Total Appointments", value: appointments.length, icon: Heart, bg: "bg-red-50", text: "text-red-600" },
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Title */}
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back!</h1>
//         <p className="text-sm text-gray-500 mt-1">Welcome, {session?.user?.name || "Patient"}. Here is your healthcare summary.</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, i) => {
//           const Icon = stat.icon;
//           return (
//             <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                     {stat.label}
//                   </p>
//                   <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
//                     {stat.value}
//                   </p>
//                 </div>
//                 <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
//                   <Icon className={`w-4 h-4 ${stat.text}`} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Grid: Upcoming appointments & Partner promo */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="bg-white border border-gray-200 rounded-xl lg:col-span-2">
//           <div className="flex items-center justify-between p-5 border-b border-gray-200">
//             <div>
//               <h3 className="text-base font-semibold text-gray-900">Upcoming Appointments</h3>
//               <p className="text-xs text-gray-500 mt-0.5">Your next visits across all medical providers.</p>
//             </div>
//             <a
//               href="/dashboard/patient/appointments"
//               className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
//             >
//               View all <ArrowRight className="w-3 h-3" />
//             </a>
//           </div>
//           <div className="divide-y divide-gray-100">
//             {upcoming.length === 0 ? (
//               <div className="p-10 text-center">
//                 <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-3">
//                   <Stethoscope className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">No upcoming appointments</p>
//                 <p className="text-xs text-gray-500 mt-1">Find a specialist and book a time that works for you.</p>
//                 <a
//                   href="/doctors"
//                   className="mt-4 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
//                 >
//                   Browse doctors
//                 </a>
//               </div>
//             ) : (
//               upcoming.slice(0, 5).map((a) => (
//                 <div key={a._id} className="p-5 flex items-center gap-4">
//                   <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
//                     {a.doctorPhoto ? (
//                       <img src={a.doctorPhoto} alt="" className="w-full h-full object-cover" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-semibold">
//                         {(a.doctorName || "D")[0]}
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-gray-900 truncate">{a.doctorName}</p>
//                     <p className="text-xs text-gray-500 mt-0.5">
//                       {a.appointmentDate} at {a.appointmentTime}
//                     </p>
//                   </div>
//                   <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 whitespace-nowrap">
//                     <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
//                     {a.appointmentStatus}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between">
//           <div>
//             <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
//               <Stethoscope className="w-5 h-5 text-blue-600" />
//             </div>
//             <h3 className="text-base font-semibold text-gray-900">Platform Medical Partners</h3>
//             <p className="text-xs text-gray-500 mt-2 leading-relaxed">
//               Quickly check available verified doctors to book your next consultation. We partner with only the finest clinics and experienced specialists.
//             </p>
//           </div>
//           <a
//             href="/doctors"
//             className="mt-6 w-full text-center inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
//           >
//             Find Doctors
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Calendar,
  History,
  CreditCard,
  Heart,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function PatientOverview() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!session?.user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-appointments?patientId=${session.user.id}`)
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [session]);

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const cardHoverBorder = theme === "dark" ? "hover:border-slate-700" : "hover:border-gray-300";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const divider = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const divLight = theme === "dark" ? "border-slate-800/50" : "border-gray-100";

  const statsColors = {
    blue: {
      bg: theme === "dark" ? "bg-blue-950/30" : "bg-blue-50",
      text: theme === "dark" ? "text-blue-400" : "text-blue-600"
    },
    orange: {
      bg: theme === "dark" ? "bg-orange-950/30" : "bg-orange-50",
      text: theme === "dark" ? "text-orange-400" : "text-orange-600"
    },
    green: {
      bg: theme === "dark" ? "bg-green-950/30" : "bg-green-50",
      text: theme === "dark" ? "text-green-400" : "text-green-600"
    },
    red: {
      bg: theme === "dark" ? "bg-red-950/30" : "bg-red-50",
      text: theme === "dark" ? "text-red-400" : "text-red-600"
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.appointmentStatus !== "Completed" && a.appointmentStatus !== "Cancelled" && a.appointmentStatus !== "Rejected");
  const history = appointments.filter(a => a.appointmentStatus === "Completed");
  const totalPaid = appointments.reduce((sum, a) => sum + (a.paymentStatus === "Paid" ? parseFloat(a.amount || 0) : 0), 0);

  const stats = [
    { label: "Upcoming Consultations", value: upcoming.length, icon: Calendar, color: "blue" },
    { label: "Completed Visits", value: history.length, icon: History, color: "orange" },
    { label: "Total Paid", value: `$${totalPaid}`, icon: CreditCard, color: "green" },
    { label: "Total Appointments", value: appointments.length, icon: Heart, color: "red" },
  ];

  return (
    <div className={`space-y-8 ${bgMain} transition-colors duration-300`}>
      {/* Title */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${textPrimary} transition-colors duration-300`}>
          Welcome back!
        </h1>
        <p className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}>
          Welcome, {session?.user?.name || "Patient"}. Here is your healthcare summary.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const colors = statsColors[stat.color];
          return (
            <div key={i} className={`${bgCard} border ${cardBorder} ${cardHoverBorder} rounded-xl p-5 transition-all duration-300`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-xs font-medium ${textSecondary} uppercase tracking-wide transition-colors duration-300`}>
                    {stat.label}
                  </p>
                  <p className={`mt-2 text-2xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}>
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Upcoming appointments & Partner promo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${bgCard} border ${cardBorder} rounded-xl lg:col-span-2 transition-colors duration-300`}>
          <div className={`flex items-center justify-between p-5 border-b ${divider} transition-colors duration-300`}>
            <div>
              <h3 className={`text-base font-semibold ${textPrimary} transition-colors duration-300`}>
                Upcoming Appointments
              </h3>
              <p className={`text-xs ${textSecondary} mt-0.5 transition-colors duration-300`}>
                Your next visits across all medical providers.
              </p>
            </div>
            <a
              href="/dashboard/patient/appointments"
              className={`text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 transition-colors`}
            >
              View all <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className={`divide-y ${divLight}`}>
            {upcoming.length === 0 ? (
              <div className="p-10 text-center">
                <div className={`w-12 h-12 mx-auto rounded-full ${statsColors.blue.bg} flex items-center justify-center mb-3 transition-colors duration-300`}>
                  <Stethoscope className={`w-5 h-5 ${statsColors.blue.text}`} />
                </div>
                <p className={`text-sm font-semibold ${textPrimary} transition-colors duration-300`}>
                  No upcoming appointments
                </p>
                <p className={`text-xs ${textSecondary} mt-1 transition-colors duration-300`}>
                  Find a specialist and book a time that works for you.
                </p>
                <a
                  href="/doctors"
                  className="mt-4 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Browse doctors
                </a>
              </div>
            ) : (
              upcoming.slice(0, 5).map((a) => (
                <div key={a._id} className="p-5 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-gray-100"} border ${cardBorder} overflow-hidden flex-shrink-0 flex items-center justify-center transition-colors duration-300`}>
                    {a.doctorPhoto ? (
                      <img src={a.doctorPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${textMuted} text-sm font-semibold`}>
                        {(a.doctorName || "D")[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${textPrimary} truncate transition-colors duration-300`}>
                      {a.doctorName}
                    </p>
                    <p className={`text-xs ${textSecondary} mt-0.5 transition-colors duration-300`}>
                      {a.appointmentDate} at {a.appointmentTime}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 ${theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-gray-200 text-gray-700"} border rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition-colors duration-300`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {a.appointmentStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`${bgCard} border ${cardBorder} rounded-xl p-6 flex flex-col justify-between transition-colors duration-300`}>
          <div>
            <div className={`w-10 h-10 rounded-lg ${statsColors.blue.bg} flex items-center justify-center mb-4 transition-colors duration-300`}>
              <Stethoscope className={`w-5 h-5 ${statsColors.blue.text}`} />
            </div>
            <h3 className={`text-base font-semibold ${textPrimary} transition-colors duration-300`}>
              Platform Medical Partners
            </h3>
            <p className={`text-xs ${textSecondary} mt-2 leading-relaxed transition-colors duration-300`}>
              Quickly check available verified doctors to book your next consultation. We partner with only the finest clinics and experienced specialists.
            </p>
          </div>
          <a
            href="/doctors"
            className="mt-6 w-full text-center inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Find Doctors
          </a>
        </div>
      </div>
    </div>
  );
}