"use client";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function JWTSetup() {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user?.email) {
      // Check if JWT token is already stored in cookies or localStorage
      const hasLocalToken = localStorage.getItem("token");
      const hasCookieToken = document.cookie.split("; ").find(row => row.startsWith("token="));

      if (!hasLocalToken || !hasCookieToken) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email })
        })
          .then(res => res.json())
          .then(data => {
            if (data.token) {
              localStorage.setItem("token", data.token);
              document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
              console.log("JWT token generated and saved.");
            }
          })
          .catch(err => console.error("JWT Setup failed:", err));
      }
    } else if (session === null) {
      // User is logged out, clear JWT
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [session]);

  return null;
}
