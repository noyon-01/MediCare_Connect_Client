"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Logo from "@/components/Logo";
import { useTheme } from "next-themes";

export default function Login() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
    if (session) {
      window.location.href = "/dashboard";
    }
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Login failed");
    } else {
      toast.success("Login successful!");
      window.location.href = "/dashboard";
    }
  };

  const handleGoogle = async (e) => {
    e.preventDefault();
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgLeft = theme === "dark" ? "bg-slate-900" : "bg-gray-50";
  const borderColor = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const inputBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const inputBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const inputText = theme === "dark" ? "text-white" : "text-gray-900";
  const inputPlaceholder =
    theme === "dark"
      ? "placeholder:text-slate-500"
      : "placeholder:text-gray-400";
  const labelColor = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const statBg =
    theme === "dark"
      ? "bg-slate-800 border-slate-700"
      : "bg-white border-gray-200";
  const statValue = theme === "dark" ? "text-white" : "text-gray-900";
  const statLabel = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const dividerColor =
    theme === "dark" ? "border-slate-800" : "border-gray-200";
  const googleBtn =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";
  const linkColor =
    theme === "dark"
      ? "text-blue-400 hover:text-blue-300"
      : "text-blue-600 hover:underline";

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen w-full flex ${bgMain} transition-colors duration-300`}
    >
      {/* Left panel: Info & stats */}
      <div
        className={`hidden lg:flex w-1/2 ${bgLeft} border-r ${borderColor} items-center justify-center p-12 relative overflow-hidden transition-colors duration-300`}
      >
        <div className="max-w-md relative z-10">
          <Logo size="lg" />
          <h2
            className={`mt-12 text-3xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
          >
            Welcome back to a smarter way of caring.
          </h2>
          <p
            className={`mt-4 ${textSecondary} leading-relaxed transition-colors duration-300`}
          >
            Access your appointments, prescriptions, and connect with verified
            specialists — all in one place.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              ["150+", "Verified doctors"],
              ["10k+", "Patients served"],
              ["24/7", "Care line"],
              ["4.9", "Average rating"],
            ].map(([v, l]) => (
              <div
                key={l}
                className={`${statBg} border rounded-xl p-4 transition-colors duration-300`}
              >
                <p
                  className={`text-2xl font-semibold ${statValue} tracking-tight transition-colors duration-300`}
                >
                  {v}
                </p>
                <p
                  className={`text-xs ${statLabel} mt-0.5 transition-colors duration-300`}
                >
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel: Login form */}
      <div
        className={`flex-1 flex items-center justify-center p-6 ${bgMain} transition-colors duration-300`}
      >
        <form onSubmit={handleLogin} noValidate className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          <h1
            className={`text-2xl font-semibold tracking-tight ${textPrimary} transition-colors duration-300`}
          >
            Sign in to your account
          </h1>
          <p
            className={`mt-1 text-sm ${textSecondary} transition-colors duration-300`}
          >
            Enter your credentials to access your dashboard.
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label
                className={`block text-xs font-medium ${labelColor} mb-1.5 transition-colors duration-300`}
              >
                Email
              </label>
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${inputText} ${inputPlaceholder} focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors duration-300`}
              />
            </div>
            <div>
              <label
                className={`block text-xs font-medium ${labelColor} mb-1.5 transition-colors duration-300`}
              >
                Password
              </label>
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3.5 py-2.5 text-sm ${inputText} ${inputPlaceholder} focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors duration-300`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus:outline-none disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${dividerColor}`} />
              </div>
              <div className="relative flex justify-center">
                <span
                  className={`${bgMain} px-2 text-xs ${textSecondary} transition-colors duration-300`}
                >
                  or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogle}
              type="button"
              className={`w-full inline-flex items-center justify-center gap-2 rounded-lg border ${googleBtn} px-4 py-2.5 text-sm font-medium transition-colors`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <p
              className={`text-center text-xs ${textSecondary} mt-6 transition-colors duration-300`}
            >
              Don't have an account?{" "}
              <a
                href="/register"
                className={`${linkColor} font-medium transition-colors`}
              >
                Create one
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
