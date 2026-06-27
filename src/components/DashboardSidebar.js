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
  User
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const PATIENT_NAV = [
  { href: "/dashboard/patient", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/patient/appointments", label: "My Appointments", icon: Calendar },
  { href: "/dashboard/patient/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/patient/reviews", label: "My Reviews", icon: Star },
];

const DOCTOR_NAV = [
  { href: "/dashboard/doctor", label: "Dashboard Overview", icon: LayoutDashboard },
  { href: "/dashboard/doctor/schedule", label: "Manage Schedules & Days", icon: Calendar },
  { href: "/dashboard/doctor/requests", label: "Appointments Inbox", icon: CalendarClock },
  { href: "/dashboard/doctor/prescriptions", label: "Prescriptions Cabin", icon: ClipboardList },
  { href: "/dashboard/doctor/credentials", label: "Profile Credentials", icon: User },
];

const ADMIN_NAV = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/doctors", label: "Doctors", icon: ShieldCheck },
  { href: "/dashboard/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/admin/payments", label: "Payments", icon: CreditCard },
];

export default function DashboardSidebar({ user, role, isVerifiedDoctor }) {
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
          }
        }
      });
    } catch (err) {
      toast.error("Logout failed: " + err.message);
    }
  };

  const nav =
    role === "admin"
      ? ADMIN_NAV
      : role === "doctor"
        ? (isVerifiedDoctor ? DOCTOR_NAV : [DOCTOR_NAV[0]])
        : PATIENT_NAV;

  const roleLabel =
    role === "admin"
      ? "Admin"
      : role === "doctor"
        ? "Doctor"
        : "Patient";

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between w-full flex-shrink-0">
        <a href="/">
          <Logo size="sm" />
        </a>
        {!mounted ? (
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-1.5 text-gray-700"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-1.5 text-gray-700"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>

      {/* Sidebar background overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed lg:sticky top-0 lg:top-0 inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 lg:h-screen overflow-y-auto transition-transform duration-300 flex flex-col`}
      >
        <div className="h-16 flex items-center px-5 border-b border-gray-200 flex-shrink-0">
          <a href="/">
            <Logo />
          </a>
        </div>
        <div className="p-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {user.image && !imgError ? (
              <img
                src={user.image}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">
                {(user.name || user.email || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {user.name || "Account"}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {user.email}
              </p>
            </div>
            <span className="inline-flex items-center bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-700 uppercase tracking-wide">
              {roleLabel}
            </span>
          </div>
        </div>
        <nav className="p-3 space-y-0.5 flex-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3 h-3" />}
              </a>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-200 flex-shrink-0 space-y-0.5">
          <div className="flex items-center justify-between px-3 py-1 mb-1.5 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500 font-medium">Dark Mode</span>
            <ThemeToggle />
          </div>
          <a
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </a>
          <a
            href="#"
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </a>
        </div>
      </aside>
    </>
  );
}
