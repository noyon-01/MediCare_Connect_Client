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

export default function AdminOverview() {
  const { data: session } = authClient.useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics || analytics.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
        {analytics?.error || "Failed to fetch admin analytics data."}
      </div>
    );
  }

  const stats = [
    { label: "TOTAL PATIENTS", value: analytics.totalPatients, icon: Users, bg: "bg-blue-50", text: "text-blue-600" },
    { label: "VERIFIED CLINICIANS", value: analytics.totalDoctors, icon: Stethoscope, bg: "bg-purple-50", text: "text-purple-600" },
    { label: "ALL BOOKINGS", value: analytics.totalAppointments, icon: Calendar, bg: "bg-orange-50", text: "text-orange-600" },
    { label: "GROSS CO-PAYS", value: `$${analytics.totalEarnings}`, icon: DollarSign, bg: "bg-green-50", text: "text-green-600" },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Clinical Hub Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Hospital Ecosystem Controls & Platform Analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${stat.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Clinician Performance */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900">Clinician Performance Index (Ratings)</h2>
          <p className="text-xs text-gray-500 mt-0.5 mb-6">Average rating scores for verified doctors</p>
          <div className="h-72 w-full">
            {analytics.performanceData && analytics.performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.performanceData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[0, 5]} />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.02)" }} contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="rating" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-xs text-gray-500 italic">
                No rating analytics available.
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-1.5 mt-2">
            <span className="w-3 h-3 bg-[#10b981] rounded-sm"></span>
            <span className="text-xs text-gray-500 font-medium">Score Rating</span>
          </div>
        </div>

        {/* Right Chart: Appointment Timeline */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900">Appointment Timeline (Last 7 Days)</h2>
          <p className="text-xs text-gray-500 mt-0.5 mb-6">Daily volume of patient bookings</p>
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
                  <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full text-xs text-gray-500 italic">
                No timeline data available.
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-1.5 mt-2">
            <span className="w-3 h-0.5 bg-[#10b981]"></span>
            <span className="text-xs text-gray-500 font-medium">Bookings Volume</span>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Specialty Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Ecosystem Specialty Breakdown</h2>
            <p className="text-xs text-gray-500 mt-0.5 mb-4">Distribution of doctors across specialties</p>
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
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full text-xs text-gray-500 italic">
                  No specialty data.
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center space-y-1.5 max-h-[190px] overflow-y-auto pr-2">
              {analytics.specialtyData && analytics.specialtyData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-semibold text-gray-700 truncate max-w-[120px]">{entry.name}</span>
                  <span className="text-gray-400">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Venn Diagram */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Ecosystem Intersections</h2>
            <p className="text-xs text-gray-500 mt-0.5">Venn diagram of active platform connections</p>
          </div>
          
          <div className="relative flex justify-center items-center h-48 mt-4">
            {/* Left Circle - Patients */}
            <div className="absolute left-[15%] sm:left-[22%] w-36 h-36 rounded-full border border-blue-200 bg-blue-50/40 flex flex-col justify-center items-center p-3 text-center transition-all hover:scale-105 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-500">Patients</span>
              <span className="text-2xl font-bold text-blue-700 mt-1">{analytics.totalPatients}</span>
            </div>

            {/* Right Circle - Clinicians */}
            <div className="absolute right-[15%] sm:right-[22%] w-36 h-36 rounded-full border border-purple-200 bg-purple-50/40 flex flex-col justify-center items-center p-3 text-center transition-all hover:scale-105 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-500">Clinicians</span>
              <span className="text-2xl font-bold text-purple-700 mt-1">{analytics.totalDoctors}</span>
            </div>

            {/* Intersecting Overlap Card */}
            <div className="absolute z-10 w-24 h-24 rounded-full border border-emerald-300 bg-emerald-50/80 backdrop-blur-md flex flex-col justify-center items-center p-2 text-center shadow-md transition-all hover:scale-110">
              <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-600 leading-tight">Active<br/>Bookers</span>
              <span className="text-xl font-extrabold text-emerald-700 mt-0.5">{analytics.activePatientCount}</span>
            </div>
          </div>
          
          <div className="text-center text-[10px] text-gray-400 mt-2">
            Intersection shows patients who have completed or have active pending schedules with verified clinicians.
          </div>
        </div>
      </div>
    </div>
  );
}
