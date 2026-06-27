"use client";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function LogoutButton({ className, children }) {
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

  return (
    <a href="#" onClick={handleLogout} className={className}>
      {children || "Logout"}
    </a>
  );
}
