// "use client";
// import { useState, useEffect } from "react";
// import { authClient } from "@/lib/auth-client";
// import { 
//   BarChart, 
//   Bar, 
//   AreaChart, 
//   Area, 
//   PieChart, 
//   Pie, 
//   Cell, 
//   XAxis, 
//   YAxis, 
//   Tooltip, 
//   ResponsiveContainer 
// } from "recharts";
// import { Users, Stethoscope, Calendar, DollarSign } from "lucide-react";

// export default function AdminOverview() {
//   const { data: session } = authClient.useSession();
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!session?.user?.id) return;
    
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`, {
//       headers: {
//         "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setAnalytics(data);
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

//   if (!analytics || analytics.error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
//         {analytics?.error || "Failed to fetch admin analytics data."}
//       </div>
//     );
//   }

//   const stats = [
//     { label: "TOTAL PATIENTS", value: analytics.totalPatients, icon: Users, bg: "bg-blue-50", text: "text-blue-600" },
//     { label: "VERIFIED CLINICIANS", value: analytics.totalDoctors, icon: Stethoscope, bg: "bg-purple-50", text: "text-purple-600" },
//     { label: "ALL BOOKINGS", value: analytics.totalAppointments, icon: Calendar, bg: "bg-orange-50", text: "text-orange-600" },
//     { label: "GROSS CO-PAYS", value: `$${analytics.totalEarnings}`, icon: DollarSign, bg: "bg-green-50", text: "text-green-600" },
//   ];

//   const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

//   return (
//     <div className="space-y-8">
//       {/* Title */}
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-gray-900">Clinical Hub Admin</h1>
//         <p className="text-sm text-gray-500 mt-1">Hospital Ecosystem Controls & Platform Analytics</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, i) => {
//           const Icon = stat.icon;
//           return (
//             <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
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

//       {/* Charts Row 1 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Left Chart: Clinician Performance */}
//         <div className="bg-white border border-gray-200 rounded-xl p-6">
//           <h2 className="text-base font-semibold text-gray-900">Clinician Performance Index (Ratings)</h2>
//           <p className="text-xs text-gray-500 mt-0.5 mb-6">Average rating scores for verified doctors</p>
//           <div className="h-72 w-full">
//             {analytics.performanceData && analytics.performanceData.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={analytics.performanceData}>
//                   <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
//                   <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[0, 5]} />
//                   <Tooltip cursor={{ fill: "rgba(0,0,0,0.02)" }} contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
//                   <Bar dataKey="rating" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="flex justify-center items-center h-full text-xs text-gray-500 italic">
//                 No rating analytics available.
//               </div>
//             )}
//           </div>
//           <div className="flex justify-center items-center gap-1.5 mt-2">
//             <span className="w-3 h-3 bg-[#10b981] rounded-sm"></span>
//             <span className="text-xs text-gray-500 font-medium">Score Rating</span>
//           </div>
//         </div>

//         {/* Right Chart: Appointment Timeline */}
//         <div className="bg-white border border-gray-200 rounded-xl p-6">
//           <h2 className="text-base font-semibold text-gray-900">Appointment Timeline (Last 7 Days)</h2>
//           <p className="text-xs text-gray-500 mt-0.5 mb-6">Daily volume of patient bookings</p>
//           <div className="h-72 w-full">
//             {analytics.timelineData && analytics.timelineData.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={analytics.timelineData}>
//                   <defs>
//                     <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
//                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
//                   <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
//                   <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
//                   <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="flex justify-center items-center h-full text-xs text-gray-500 italic">
//                 No timeline data available.
//               </div>
//             )}
//           </div>
//           <div className="flex justify-center items-center gap-1.5 mt-2">
//             <span className="w-3 h-0.5 bg-[#10b981]"></span>
//             <span className="text-xs text-gray-500 font-medium">Bookings Volume</span>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Left: Specialty Breakdown */}
//         <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between">
//           <div>
//             <h2 className="text-base font-semibold text-gray-900">Ecosystem Specialty Breakdown</h2>
//             <p className="text-xs text-gray-500 mt-0.5 mb-4">Distribution of doctors across specialties</p>
//           </div>
//           <div className="flex flex-row items-center justify-around h-52">
//             <div className="h-full w-1/2 min-w-[150px]">
//               {analytics.specialtyData && analytics.specialtyData.length > 0 ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={analytics.specialtyData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={55}
//                       outerRadius={75}
//                       paddingAngle={4}
//                       dataKey="value"
//                     >
//                       {analytics.specialtyData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="flex justify-center items-center h-full text-xs text-gray-500 italic">
//                   No specialty data.
//                 </div>
//               )}
//             </div>
//             <div className="flex flex-col justify-center space-y-1.5 max-h-[190px] overflow-y-auto pr-2">
//               {analytics.specialtyData && analytics.specialtyData.map((entry, index) => (
//                 <div key={entry.name} className="flex items-center gap-2 text-xs">
//                   <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
//                   <span className="font-semibold text-gray-700 truncate max-w-[120px]">{entry.name}</span>
//                   <span className="text-gray-400">({entry.value})</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right: Venn Diagram */}
//         <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between h-full">
//           <div>
//             <h2 className="text-base font-semibold text-gray-900">Ecosystem Intersections</h2>
//             <p className="text-xs text-gray-500 mt-0.5">Venn diagram of active platform connections</p>
//           </div>
          
//           <div className="relative flex justify-center items-center h-48 mt-4">
//             {/* Left Circle - Patients */}
//             <div className="absolute left-[15%] sm:left-[22%] w-36 h-36 rounded-full border border-blue-200 bg-blue-50/40 flex flex-col justify-center items-center p-3 text-center transition-all hover:scale-105 shadow-sm">
//               <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-500">Patients</span>
//               <span className="text-2xl font-bold text-blue-700 mt-1">{analytics.totalPatients}</span>
//             </div>

//             {/* Right Circle - Clinicians */}
//             <div className="absolute right-[15%] sm:right-[22%] w-36 h-36 rounded-full border border-purple-200 bg-purple-50/40 flex flex-col justify-center items-center p-3 text-center transition-all hover:scale-105 shadow-sm">
//               <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-500">Clinicians</span>
//               <span className="text-2xl font-bold text-purple-700 mt-1">{analytics.totalDoctors}</span>
//             </div>

//             {/* Intersecting Overlap Card */}
//             <div className="absolute z-10 w-24 h-24 rounded-full border border-emerald-300 bg-emerald-50/80 backdrop-blur-md flex flex-col justify-center items-center p-2 text-center shadow-md transition-all hover:scale-110">
//               <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-600 leading-tight">Active<br/>Bookers</span>
//               <span className="text-xl font-extrabold text-emerald-700 mt-0.5">{analytics.activePatientCount}</span>
//             </div>
//           </div>
          
//           <div className="text-center text-[10px] text-gray-400 mt-2">
//             Intersection shows patients who have completed or have active pending schedules with verified clinicians.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Users, Stethoscope, Calendar, DollarSign } from "lucide-react";
import { useTheme } from "next-themes";

export default function AdminOverview() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!session?.user?.id) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setAnalytics(data);
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
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-400";
  const chartText = theme === "dark" ? "#94a3b8" : "#888888";
  const tooltipBg = theme === "dark" ? "#1e293b" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "#334155" : "#e5e7eb";
  const tooltipText = theme === "dark" ? "#e2e8f0" : "#333333";
  const errorBg = theme === "dark" ? "bg-red-950/30 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-800";
  const statsIconBg = {
    blue: theme === "dark" ? "bg-blue-950/30" : "bg-blue-50",
    purple: theme === "dark" ? "bg-purple-950/30" : "bg-purple-50",
    orange: theme === "dark" ? "bg-orange-950/30" : "bg-orange-50",
    green: theme === "dark" ? "bg-green-950/30" : "bg-green-50",
  };
  const statsIconText = {
    blue: theme === "dark" ? "text-blue-400" : "text-blue-600",
    purple: theme === "dark" ? "text-purple-400" : "text-purple-600",
    orange: theme === "dark" ? "text-orange-400" : "text-orange-600",
    green: theme === "dark" ? "text-green-400" : "text-green-600",
  };
  const vennColors = {
    patients: theme === "dark" ? "border-blue-700 bg-blue-950/30 text-blue-400" : "border-blue-200 bg-blue-50/40 text-blue-500",
    patientsText: theme === "dark" ? "text-blue-300" : "text-blue-700",
    clinicians: theme === "dark" ? "border-purple-700 bg-purple-950/30 text-purple-400" : "border-purple-200 bg-purple-50/40 text-purple-500",
    cliniciansText: theme === "dark" ? "text-purple-300" : "text-purple-700",
    overlap: theme === "dark" ? "border-emerald-700 bg-emerald-950/40 text-emerald-400" : "border-emerald-300 bg-emerald-50/80 text-emerald-600",
    overlapText: theme === "dark" ? "text-emerald-300" : "text-emerald-700",
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics || analytics.error) {
    return (
      <div className={`${errorBg} border rounded-xl p-4 text-sm transition-colors duration-300`}>
        {analytics?.error || "Failed to fetch admin analytics data."}
      </div>
    );
  }

  const stats = [
    { label: "TOTAL PATIENTS", value: analytics.totalPatients, icon: Users, color: "blue" },
    { label: "VERIFIED CLINICIANS", value: analytics.totalDoctors, icon: Stethoscope, color: "purple" },
    { label: "ALL BOOKINGS", value: analytics.totalAppointments, icon: Calendar, color: "orange" },
    { label: "GROSS CO-PAYS", value: `$${analytics.totalEarnings}`, icon: DollarSign, color: "green" },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

  return (
    <div className={`space-y-8 ${bgMain} transition-colors duration-300`}>
      {/* Title */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${textPrimary} transition-colors duration-300`}>
          Clinical Hub Admin
        </h1>
        <p className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}>
          Hospital Ecosystem Controls & Platform Analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const color = stat.color;
          return (
            <div key={i} className={`${bgCard} border ${cardBorder} ${cardHoverBorder} rounded-xl p-5 transition-all duration-300`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-xs font-semibold ${textMuted} uppercase tracking-wide transition-colors duration-300`}>
                    {stat.label}
                  </p>
                  <p className={`mt-2 text-2xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-9 h-9 rounded-lg ${statsIconBg[color]} flex items-center justify-center flex-shrink-0 transition-colors duration-300`}>
                  <Icon className={`w-4 h-4 ${statsIconText[color]}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Clinician Performance */}
        <div className={`${bgCard} border ${cardBorder} rounded-xl p-6 transition-colors duration-300`}>
          <h2 className={`text-base font-semibold ${textPrimary} transition-colors duration-300`}>
            Clinician Performance Index (Ratings)
          </h2>
          <p className={`text-xs ${textSecondary} mt-0.5 mb-6 transition-colors duration-300`}>
            Average rating scores for verified doctors
          </p>
          <div className="h-72 w-full">
            {analytics.performanceData && analytics.performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.performanceData}>
                  <XAxis dataKey="name" stroke={chartText} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartText} fontSize={11} tickLine={false} axisLine={false} domain={[0, 5]} />
                  <Tooltip 
                    cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }} 
                    contentStyle={{ 
                      background: tooltipBg, 
                      border: `1px solid ${tooltipBorder}`, 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      color: tooltipText
                    }} 
                  />
                  <Bar dataKey="rating" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className={`flex justify-center items-center h-full text-xs ${textSecondary} italic transition-colors duration-300`}>
                No rating analytics available.
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-1.5 mt-2">
            <span className="w-3 h-3 bg-[#10b981] rounded-sm"></span>
            <span className={`text-xs ${textSecondary} font-medium transition-colors duration-300`}>Score Rating</span>
          </div>
        </div>

        {/* Right Chart: Appointment Timeline */}
        <div className={`${bgCard} border ${cardBorder} rounded-xl p-6 transition-colors duration-300`}>
          <h2 className={`text-base font-semibold ${textPrimary} transition-colors duration-300`}>
            Appointment Timeline (Last 7 Days)
          </h2>
          <p className={`text-xs ${textSecondary} mt-0.5 mb-6 transition-colors duration-300`}>
            Daily volume of patient bookings
          </p>
          <div className="h-72 w-full">
            {analytics.timelineData && analytics.timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.timelineData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke={chartText} fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartText} fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: tooltipBg, 
                      border: `1px solid ${tooltipBorder}`, 
                      borderRadius: '8px', 
                      fontSize: '11px',
                      color: tooltipText
                    }} 
                  />
                  <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className={`flex justify-center items-center h-full text-xs ${textSecondary} italic transition-colors duration-300`}>
                No timeline data available.
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-1.5 mt-2">
            <span className="w-3 h-0.5 bg-[#10b981]"></span>
            <span className={`text-xs ${textSecondary} font-medium transition-colors duration-300`}>Bookings Volume</span>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Specialty Breakdown */}
        <div className={`${bgCard} border ${cardBorder} rounded-xl p-6 flex flex-col justify-between transition-colors duration-300`}>
          <div>
            <h2 className={`text-base font-semibold ${textPrimary} transition-colors duration-300`}>
              Ecosystem Specialty Breakdown
            </h2>
            <p className={`text-xs ${textSecondary} mt-0.5 mb-4 transition-colors duration-300`}>
              Distribution of doctors across specialties
            </p>
          </div>
          <div className="flex flex-row items-center justify-around h-52">
            <div className="h-full w-1/2 min-w-[150px]">
              {analytics.specialtyData && analytics.specialtyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.specialtyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {analytics.specialtyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: tooltipBg, 
                        border: `1px solid ${tooltipBorder}`, 
                        borderRadius: '8px', 
                        fontSize: '11px',
                        color: tooltipText
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className={`flex justify-center items-center h-full text-xs ${textSecondary} italic transition-colors duration-300`}>
                  No specialty data.
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center space-y-1.5 max-h-[190px] overflow-y-auto pr-2">
              {analytics.specialtyData && analytics.specialtyData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className={`font-semibold ${textPrimary} truncate max-w-[120px] transition-colors duration-300`}>
                    {entry.name}
                  </span>
                  <span className={`${textMuted} transition-colors duration-300`}>({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Venn Diagram */}
        <div className={`${bgCard} border ${cardBorder} rounded-xl p-6 flex flex-col justify-between h-full transition-colors duration-300`}>
          <div>
            <h2 className={`text-base font-semibold ${textPrimary} transition-colors duration-300`}>
              Ecosystem Intersections
            </h2>
            <p className={`text-xs ${textSecondary} mt-0.5 transition-colors duration-300`}>
              Venn diagram of active platform connections
            </p>
          </div>
          
          <div className="relative flex justify-center items-center h-48 mt-4">
            {/* Left Circle - Patients */}
            <div className={`absolute left-[15%] sm:left-[22%] w-36 h-36 rounded-full border ${vennColors.patients} flex flex-col justify-center items-center p-3 text-center transition-all hover:scale-105 shadow-sm`}>
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${vennColors.patients} transition-colors duration-300`}>Patients</span>
              <span className={`text-2xl font-bold ${vennColors.patientsText} mt-1 transition-colors duration-300`}>{analytics.totalPatients}</span>
            </div>

            {/* Right Circle - Clinicians */}
            <div className={`absolute right-[15%] sm:right-[22%] w-36 h-36 rounded-full border ${vennColors.clinicians} flex flex-col justify-center items-center p-3 text-center transition-all hover:scale-105 shadow-sm`}>
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${vennColors.clinicians} transition-colors duration-300`}>Clinicians</span>
              <span className={`text-2xl font-bold ${vennColors.cliniciansText} mt-1 transition-colors duration-300`}>{analytics.totalDoctors}</span>
            </div>

            {/* Intersecting Overlap Card */}
            <div className={`absolute z-10 w-24 h-24 rounded-full border ${vennColors.overlap} backdrop-blur-md flex flex-col justify-center items-center p-2 text-center shadow-md transition-all hover:scale-110`}>
              <span className={`text-[9px] uppercase tracking-wider font-bold ${vennColors.overlap} leading-tight transition-colors duration-300`}>Active<br/>Bookers</span>
              <span className={`text-xl font-extrabold ${vennColors.overlapText} mt-0.5 transition-colors duration-300`}>{analytics.activePatientCount}</span>
            </div>
          </div>
          
          <div className={`text-center text-[10px] ${textMuted} mt-2 transition-colors duration-300`}>
            Intersection shows patients who have completed or have active pending schedules with verified clinicians.
          </div>
        </div>
      </div>
    </div>
  );
}