"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Search, Ban, Check, Trash2 } from "lucide-react";

export default function AdminUsers() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = () => {
    if (!session?.user?.id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success(`User successfully ${nextStatus === "suspended" ? "suspended" : "activated"}!`);
        fetchUsers();
      } else {
        toast.error("Failed to update user status.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user permanently?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || session.session?.token || ""}`
        }
      });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Users</h1>
        <p className="text-sm text-gray-500 mt-1">View, suspend, active, and delete accounts registered on the platform.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or email…"
              className="flex-1 bg-transparent text-sm outline-none border-none focus:ring-0"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No accounts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Contact Details
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-55/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {u.image ? (
                          <img
                            src={u.image}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">
                            {(u.name || u.email || "U")[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {u.name || "—"}
                          </p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-700 uppercase tracking-wide">
                        {u.role || "patient"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">
                      <p>{u.phone || "No Phone"}</p>
                      <p className="text-gray-400 capitalize text-[10px] mt-0.5">{u.gender || "—"}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-xs text-gray-700">
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
                                className="inline-flex items-center gap-1 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-lg px-2.5 py-1.5 text-xs text-green-600 transition-colors"
                              >
                                <Check className="w-3 h-3" /> Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleSuspend(u._id, u.status)}
                                className="inline-flex items-center gap-1 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-lg px-2.5 py-1.5 text-xs text-orange-600 transition-colors"
                              >
                                <Ban className="w-3 h-3" /> Suspend
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(u._id)}
                              className="inline-flex items-center gap-1 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg px-2.5 py-1.5 text-xs text-red-600 transition-colors"
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
