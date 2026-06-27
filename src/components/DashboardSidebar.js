"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Star,
  CalendarClock,
  Users,
  ShieldCheck,
  ClipboardList,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  LogOut,
  User,
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

const PATIENT_NAV = [
  { href: "/dashboard/patient", label: "Overview", icon: LayoutDashboard },
  {
    href: "/dashboard/patient/appointments",
    label: "My Appointments",
    icon: Calendar,
  },
  { href: "/dashboard/patient/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/patient/reviews", label: "My Reviews", icon: Star },
];

const DOCTOR_NAV = [
  {
    href: "/dashboard/doctor",
    label: "Dashboard Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/doctor/schedule",
    label: "Manage Schedules & Days",
    icon: Calendar,
  },
  {
    href: "/dashboard/doctor/requests",
    label: "Appointments Inbox",
    icon: CalendarClock,
  },
  {
    href: "/dashboard/doctor/prescriptions",
    label: "Prescriptions Cabin",
    icon: ClipboardList,
  },
  {
    href: "/dashboard/doctor/credentials",
    label: "Profile Credentials",
    icon: User,
  },
];

const ADMIN_NAV = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/doctors", label: "Doctors", icon: ShieldCheck },
  {
    href: "/dashboard/admin/appointments",
    label: "Appointments",
    icon: Calendar,
  },
  { href: "/dashboard/admin/payments", label: "Payments", icon: CreditCard },
];

export default function DashboardSidebar({ user, role, isVerifiedDoctor }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            window.location.href = "/login";
          },
        },
      });
    } catch (err) {
      toast.error("Logout failed: " + err.message);
    }
  };

  const nav =
    role === "admin"
      ? ADMIN_NAV
      : role === "doctor"
        ? isVerifiedDoctor
          ? DOCTOR_NAV
          : [DOCTOR_NAV[0]]
        : PATIENT_NAV;

  const roleLabel =
    role === "admin" ? "Admin" : role === "doctor" ? "Doctor" : "Patient";

  // Theme based classes
  const sidebarBg = theme === "dark" ? "bg-slate-900" : "bg-white";
  const sidebarBorder =
    theme === "dark" ? "border-slate-800" : "border-gray-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const mobileBarBg = theme === "dark" ? "bg-slate-900" : "bg-white";
  const mobileBarBorder =
    theme === "dark" ? "border-slate-800" : "border-gray-200";
  const navActive =
    theme === "dark"
      ? "bg-blue-950/30 text-blue-400"
      : "bg-blue-50 text-blue-600";
  const navHover = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-50";
  const navText =
    theme === "dark"
      ? "text-slate-300 hover:text-white"
      : "text-gray-700 hover:text-gray-900";
  const roleBadge =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const userInfoBg = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const themeToggleBg = theme === "dark" ? "bg-slate-800" : "bg-gray-50";
  const overlayBg = theme === "dark" ? "bg-black/50" : "bg-black/30";
  const logoutHover =
    theme === "dark" ? "hover:bg-red-950/30" : "hover:bg-red-50";
  const backHover =
    theme === "dark"
      ? "hover:bg-slate-800 hover:text-white"
      : "hover:bg-gray-50 hover:text-gray-900";

  if (!mounted) return null;

  return (
    <>
      {/* Mobile top bar */}
      <div
        className={`lg:hidden sticky top-0 z-30 ${mobileBarBg} border-b ${mobileBarBorder} px-4 h-14 flex items-center justify-between w-full flex-shrink-0 transition-colors duration-300`}
      >
        <a href="/">
          <Logo size="sm" />
        </a>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`p-1.5 ${textSecondary} hover:${textPrimary} transition-colors`}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar background overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className={`lg:hidden fixed inset-0 ${overlayBg} z-30`}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed lg:sticky top-0 lg:top-0 inset-y-0 left-0 z-40 w-64 ${sidebarBg} border-r ${sidebarBorder} lg:h-screen overflow-y-auto transition-transform duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div
          className={`h-16 flex items-center px-5 border-b ${sidebarBorder} flex-shrink-0 transition-colors duration-300`}
        >
          <a href="/">
            <Logo />
          </a>
        </div>

        {/* User Info */}
        <div
          className={`p-3 border-b ${sidebarBorder} flex-shrink-0 transition-colors duration-300`}
        >
          <div className="flex items-center gap-2.5">
            {user.image && !imgError ? (
              <img
                src={user.image}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-slate-700/20"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center transition-colors duration-300">
                {(user.name || user.email || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-semibold ${textPrimary} truncate transition-colors duration-300`}
              >
                {user.name || "Account"}
              </p>
              <p
                className={`text-[10px] ${textSecondary} truncate transition-colors duration-300`}
              >
                {user.email}
              </p>
            </div>
            <span
              className={`inline-flex items-center ${roleBadge} border rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide transition-colors duration-300`}
            >
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-0.5 flex-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  active ? `${navActive} font-medium` : `${navText} ${navHover}`
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-inherit" : ""}`} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3 h-3 opacity-60" />}
              </a>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div
          className={`p-3 border-t ${sidebarBorder} flex-shrink-0 space-y-0.5 transition-colors duration-300`}
        >
          <div
            className={`flex items-center justify-between px-3 py-1 mb-1.5 ${themeToggleBg} rounded-lg transition-colors duration-300`}
          >
            <span
              className={`text-xs ${textSecondary} font-medium transition-colors duration-300`}
            >
              Dark Mode
            </span>
            <ThemeToggle />
          </div>
          <a
            href="/"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${textSecondary} ${backHover} transition-all duration-200`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </a>
          <a
            href="#"
            onClick={handleLogout}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 ${logoutHover} transition-all duration-200`}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </a>
        </div>
      </aside>
    </>
  );
}
