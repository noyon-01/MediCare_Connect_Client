"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Search, Ban, Check, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";

export default function AdminUsers() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUsers = () => {
    if (!session?.user?.id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [session]);

  const toggleSuspend = async (id, currentStatus) => {
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success(
          `User successfully ${nextStatus === "suspended" ? "suspended" : "activated"}!`,
        );
        fetchUsers();
      } else {
        toast.error("Failed to update user status.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user permanently?"))
      return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`,
          },
        },
      );
      const data = await res.json();
      if (data.deletedCount > 0) {
        toast.success("User deleted successfully.");
        fetchUsers();
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (
      search &&
      !(
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      )
    )
      return false;
    return true;
  });

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const divider = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const divLight = theme === "dark" ? "border-slate-800/50" : "border-gray-100";
  const tableHeader = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const tableRowHover =
    theme === "dark" ? "hover:bg-slate-800/50" : "hover:bg-gray-50/50";
  const inputBg = theme === "dark" ? "bg-slate-800" : "bg-gray-50";
  const inputBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const inputText = theme === "dark" ? "text-white" : "text-gray-900";
  const selectBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const selectBorder =
    theme === "dark" ? "border-slate-700" : "border-gray-200";
  const avatarBg =
    theme === "dark"
      ? "bg-blue-950/30 text-blue-400"
      : "bg-blue-50 text-blue-600";
  const roleBadge =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const statusPill =
    theme === "dark"
      ? "bg-slate-800 border-slate-700 text-slate-300"
      : "bg-white border-gray-200 text-gray-700";
  const activateBtn =
    theme === "dark"
      ? "bg-slate-800 hover:bg-green-950/30 border-slate-700 hover:border-green-800 text-green-400"
      : "bg-white hover:bg-green-50 border-gray-200 hover:border-green-200 text-green-600";
  const suspendBtn =
    theme === "dark"
      ? "bg-slate-800 hover:bg-orange-950/30 border-slate-700 hover:border-orange-800 text-orange-400"
      : "bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-200 text-orange-600";
  const deleteBtn =
    theme === "dark"
      ? "bg-slate-800 hover:bg-red-950/30 border-slate-700 hover:border-red-800 text-red-400"
      : "bg-white hover:bg-red-50 border-gray-200 hover:border-red-200 text-red-600";
  const emptyText = theme === "dark" ? "text-slate-400" : "text-gray-500";

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${bgMain} transition-colors duration-300`}>
      {/* Title */}
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${textPrimary} transition-colors duration-300`}
        >
          Manage Users
        </h1>
        <p
          className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}
        >
          View, suspend, active, and delete accounts registered on the platform.
        </p>
      </div>

      {/* Filters Bar */}
      <div
        className={`${bgCard} border ${cardBorder} rounded-xl p-4 transition-colors duration-300`}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3">
          <div
            className={`flex items-center gap-2 ${inputBg} border ${inputBorder} rounded-lg px-3 py-2 transition-colors duration-300`}
          >
            <Search className={`w-4 h-4 ${textMuted}`} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or email…"
              className={`flex-1 bg-transparent text-sm ${inputText} outline-none border-none focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-300`}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={`rounded-lg border ${selectBorder} ${selectBg} px-3 py-2 text-sm ${textPrimary} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
          >
            <option value="all">All Roles</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div
        className={`${bgCard} border ${cardBorder} rounded-xl overflow-hidden transition-colors duration-300`}
      >
        {filtered.length === 0 ? (
          <div className={`p-12 text-center text-sm ${emptyText}`}>
            No accounts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead
                className={`border-b ${divider} transition-colors duration-300`}
              >
                <tr className="text-left">
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    User
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Role
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Contact Details
                  </th>
                  <th
                    className={`px-5 py-3 text-xs font-medium ${tableHeader} uppercase tracking-wide transition-colors duration-300`}
                  >
                    Status
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className={`divide-y ${divLight}`}>
                {filtered.map((u) => (
                  <tr
                    key={u._id}
                    className={`${tableRowHover} transition-colors duration-200`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {u.image ? (
                          <img
                            src={u.image}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full ${avatarBg} text-xs font-semibold flex items-center justify-center transition-colors duration-300`}
                          >
                            {(u.name || u.email || "U")[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p
                            className={`text-sm font-semibold ${textPrimary} transition-colors duration-300`}
                          >
                            {u.name || "—"}
                          </p>
                          <p
                            className={`text-xs ${textSecondary} transition-colors duration-300`}
                          >
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center ${roleBadge} border rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide transition-colors duration-300`}
                      >
                        {u.role || "patient"}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-xs ${textSecondary} transition-colors duration-300`}
                    >
                      <p>{u.phone || "No Phone"}</p>
                      <p
                        className={`${textMuted} capitalize text-[10px] mt-0.5 transition-colors duration-300`}
                      >
                        {u.gender || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 ${statusPill} border rounded-full px-2.5 py-0.5 text-xs transition-colors duration-300`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === "suspended"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        />
                        {u.status || "active"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        {u.role !== "admin" && (
                          <>
                            {u.status === "suspended" ? (
                              <button
                                onClick={() => toggleSuspend(u._id, u.status)}
                                className={`inline-flex items-center gap-1 ${activateBtn} rounded-lg px-2.5 py-1.5 text-xs transition-colors border`}
                              >
                                <Check className="w-3 h-3" /> Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleSuspend(u._id, u.status)}
                                className={`inline-flex items-center gap-1 ${suspendBtn} rounded-lg px-2.5 py-1.5 text-xs transition-colors border`}
                              >
                                <Ban className="w-3 h-3" /> Suspend
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(u._id)}
                              className={`inline-flex items-center gap-1 ${deleteBtn} rounded-lg px-2.5 py-1.5 text-xs transition-colors border`}
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
