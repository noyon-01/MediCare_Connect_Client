"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const links = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Find Doctors" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar({ session }) {
  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ddRef = useRef(null);

  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentPath(pathname);
  }, [pathname]);

  useEffect(() => {
    const handle = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center">
              <Logo />
            </a>
            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => {
                const active = currentPath === l.href;
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      active
                        ? "text-gray-900 font-medium bg-gray-50"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {l.label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <>
                <a
                  href="/dashboard"
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </a>
                <div className="relative" ref={ddRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 pl-1 pr-3 py-1 hover:border-gray-300 transition-colors"
                  >
                    {user.image && !imgError ? (
                      <img
                        src={user.image}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-semibold">
                        {(user.name || user.email || "U")[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-medium text-gray-700 max-w-[120px] truncate">
                      {user.name || user.email}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name || "Account"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        {user.role && (
                          <span className="mt-2 inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-700 uppercase tracking-wide">
                            {user.role}
                          </span>
                        )}
                      </div>
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </a>
                      <a
                        href="#"
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                      >
                        Sign out
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className={
                    currentPath === "/login"
                      ? "inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
                      : "text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors"
                  }
                >
                  Login
                </a>
                <a
                  href="/register"
                  className={
                    currentPath === "/login"
                      ? "text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors"
                      : "inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg"
                  }
                >
                  Register
                </a>
              </>
            )}
          </div>

          {!mounted ? (
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-700"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 md:hidden">
              <ThemeToggle />
              <button
                className="p-2 rounded-lg hover:bg-gray-50 text-gray-700"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
              {user ? (
                <>
                  <a
                    href="/dashboard"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="block px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign out
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="block px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center"
                  >
                    Register
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
