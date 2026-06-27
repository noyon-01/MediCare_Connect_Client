"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Logo from "@/components/Logo";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState("patient");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      window.location.href = "/dashboard";
    }
  }, [session]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Status is active by default for patients, pending verification for doctors
    const status = role === "doctor" ? "pending" : "active";

    const { data, error } = await authClient.signUp.email({ 
      email, 
      password, 
      name, 
      image: photo,
      role,
      phone,
      gender,
      status
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Registration failed");
    } else {
      toast.success("Registration successful!");
      window.location.href = "/dashboard";
    }
  };

  const handleGoogle = async (e) => {
    e.preventDefault();
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `/dashboard?register_role=${role}`,
      additionalData: {
        role,
        status: role === "doctor" ? "pending" : "active",
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left panel: Info & bullet points */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 border-r border-gray-200 items-center justify-center p-12">
        <div className="max-w-md">
          <Logo size="lg" />
          <h2 className="mt-12 text-3xl font-semibold tracking-tight text-gray-900">
            Join the future of healthcare.
          </h2>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Whether you're seeking care or providing it, MediCare Connect gives
            you the tools to do it better.
          </p>

          <div className="mt-10 space-y-3">
            {[
              "Book appointments instantly with verified specialists",
              "Manage your medical records & prescriptions securely",
              "Pay & confirm in seconds with Stripe",
              "Connect with patients you can actually help",
            ].map((t) => (
              <div key={t} className="text-sm text-gray-600 py-1">
                <span className="text-gray-400 mr-2">-</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel: Signup form */}
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <form onSubmit={handleRegister} noValidate className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Get set up in less than a minute.
          </p>

          <div className="mt-8 space-y-4">
            {/* role tabs */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
              {[
                ["patient", "I'm a Patient"],
                ["doctor", "I'm a Doctor"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setRole(k)}
                  className={`flex-1 text-xs font-medium py-2 rounded-md transition-colors ${
                    role === k
                      ? "bg-white text-gray-900 border border-gray-200 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Full Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Phone Number
              </label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Photo URL (optional)
              </label>
              <input
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 chars, 1 number, 1 symbol"
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus:outline-none disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">
                  or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogle}
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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

            <p className="text-center text-xs text-gray-500 mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
