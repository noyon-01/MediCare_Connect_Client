"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Star, Edit2, Trash2, Plus } from "lucide-react";
import { useTheme } from "next-themes";

export default function PatientReviews() {
  const { theme } = useTheme();
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [editingReview, setEditingReview] = useState(null);
  const [addingReview, setAddingReview] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = () => {
    if (!session?.user?.id) return;

    const appPromise = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-appointments?patientId=${session.user.id}`,
    ).then((res) => res.json());

    const revPromise = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reviews?patientId=${session.user.id}`,
    ).then((res) => res.json());

    Promise.all([appPromise, revPromise])
      .then(([apps, revs]) => {
        setAppointments(apps);
        setReviews(revs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (data.deletedCount > 0) {
        toast.success("Review deleted successfully.");
        fetchData();
      } else {
        toast.error("Failed to delete review.");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const visitedDoctors = appointments.reduce((acc, app) => {
    if (app.doctorId && !acc.some((d) => d.doctorId === app.doctorId)) {
      acc.push({ doctorId: app.doctorId, doctorName: app.doctorName });
    }
    return acc;
  }, []);

  // Theme based classes
  const bgMain = theme === "dark" ? "bg-slate-950" : "bg-white";
  const bgCard = theme === "dark" ? "bg-slate-900" : "bg-white";
  const cardBorder = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const textMuted = theme === "dark" ? "text-slate-500" : "text-gray-500";
  const divider = theme === "dark" ? "border-slate-800" : "border-gray-200";
  const divLight = theme === "dark" ? "border-slate-800/50" : "border-gray-100";
  const emptyIcon = theme === "dark" ? "text-slate-600" : "text-gray-300";
  const reviewText = theme === "dark" ? "text-slate-300" : "text-gray-600";
  const modalBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-gray-200";
  const overlayBg = theme === "dark" ? "bg-black/60" : "bg-black/40";
  const inputBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const inputBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const btnHover = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-50";
  const deleteHover =
    theme === "dark"
      ? "hover:bg-red-950/30 hover:border-red-800"
      : "hover:bg-red-50 hover:border-red-200";

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
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${textPrimary} transition-colors duration-300`}
          >
            My Reviews
          </h1>
          <p
            className={`text-sm ${textSecondary} mt-1 transition-colors duration-300`}
          >
            Manage reviews and ratings you left for our doctors.
          </p>
        </div>
        <button
          onClick={() => setAddingReview(true)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          Write a review
        </button>
      </div>

      {/* Grid List */}
      {reviews.length === 0 ? (
        <div
          className={`${bgCard} border ${cardBorder} rounded-xl p-12 text-center transition-colors duration-300`}
        >
          <Star
            className={`w-8 h-8 mx-auto ${emptyIcon} mb-3 transition-colors duration-300`}
          />
          <p
            className={`text-sm font-semibold ${textPrimary} transition-colors duration-300`}
          >
            No reviews yet
          </p>
          <p
            className={`text-xs ${textSecondary} mt-1 transition-colors duration-300`}
          >
            Share your experience after a visit to help others choose well.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className={`${bgCard} border ${cardBorder} rounded-xl p-5 flex flex-col justify-between transition-colors duration-300`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold ${textPrimary} truncate transition-colors duration-300`}
                    >
                      {r.doctorName}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating
                              ? "text-orange-500 fill-orange-500"
                              : "text-gray-200 dark:text-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] ${textMuted} whitespace-nowrap transition-colors duration-300`}
                  >
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                {r.reviewText && (
                  <p
                    className={`mt-3 text-sm ${reviewText} leading-relaxed italic transition-colors duration-300`}
                  >
                    "{r.reviewText}"
                  </p>
                )}
              </div>

              <div
                className={`mt-4 pt-3 border-t ${divLight} flex items-center justify-end gap-1.5 transition-colors duration-300`}
              >
                <button
                  onClick={() => setEditingReview(r)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${cardBorder} text-xs ${textSecondary} ${btnHover} transition-colors duration-300`}
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${cardBorder} text-xs text-red-600 dark:text-red-400 ${deleteHover} transition-colors duration-300`}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write/Edit Review Modal */}
      {(addingReview || editingReview) && (
        <ReviewModal
          review={editingReview}
          visitedDoctors={visitedDoctors}
          onClose={() => {
            setAddingReview(false);
            setEditingReview(null);
          }}
          onSaved={() => {
            setAddingReview(false);
            setEditingReview(null);
            fetchData();
          }}
          patientId={session?.user?.id}
          patientName={session?.user?.name}
          theme={theme}
        />
      )}
    </div>
  );
}

function ReviewModal({
  review,
  visitedDoctors,
  onClose,
  onSaved,
  patientId,
  patientName,
  theme,
}) {
  const [rating, setRating] = useState(review?.rating || 5);
  const [reviewText, setReviewText] = useState(review?.reviewText || "");
  const [doctorId, setDoctorId] = useState(
    review?.doctorId || visitedDoctors[0]?.doctorId || "",
  );

  // Theme based classes
  const modalBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-gray-200";
  const overlayBg = theme === "dark" ? "bg-black/60" : "bg-black/40";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-gray-500";
  const inputBg = theme === "dark" ? "bg-slate-800" : "bg-white";
  const inputBorder = theme === "dark" ? "border-slate-700" : "border-gray-200";
  const btnHover = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-50";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review && !doctorId) {
      toast.error("Please select a doctor to review.");
      return;
    }

    const doctorName = review
      ? review.doctorName
      : visitedDoctors.find((d) => d.doctorId === doctorId)?.doctorName ||
        "Doctor";

    try {
      if (review) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/${review._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rating: parseInt(rating),
              reviewText,
            }),
          },
        );
        const data = await res.json();
        if (data.modifiedCount > 0) {
          toast.success("Review updated successfully!");
          onSaved();
        } else {
          toast.error("Failed to update review.");
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId,
            patientName,
            doctorId,
            doctorName,
            rating: parseInt(rating),
            reviewText,
          }),
        });
        const data = await res.json();
        if (data.acknowledged) {
          toast.success("Review added successfully!");
          onSaved();
        } else {
          toast.error("Failed to add review.");
        }
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 ${overlayBg} flex items-center justify-center p-4 backdrop-blur-xs`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${modalBg} border rounded-xl p-6 max-w-sm w-full shadow-2xl transition-colors duration-300`}
      >
        <h3
          className={`text-base font-semibold ${textPrimary} transition-colors duration-300`}
        >
          {review ? "Edit review" : "Write a review"}
        </h3>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {!review && (
            <div>
              <label
                className={`block text-xs font-medium ${textSecondary} mb-1.5 transition-colors duration-300`}
              >
                Doctor
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
                required
              >
                <option value="">Select a doctor</option>
                {visitedDoctors.map((d) => (
                  <option key={d.doctorId} value={d.doctorId}>
                    {d.doctorName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label
              className={`block text-xs font-medium ${textSecondary} mb-1.5 transition-colors duration-300`}
            >
              Rating
            </label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} onClick={() => setRating(i + 1)} type="button">
                  <Star
                    className={`w-6 h-6 ${
                      i < rating
                        ? "text-orange-500 fill-orange-500"
                        : "text-gray-200 dark:text-slate-700"
                    } transition-colors duration-300`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              className={`block text-xs font-medium ${textSecondary} mb-1.5 transition-colors duration-300`}
            >
              Your review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className={`w-full rounded-lg border ${inputBorder} ${inputBg} px-3 py-2 text-sm ${textPrimary} placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-300`}
              placeholder="Share your experience…"
              required
            />
          </div>
          <div className="mt-5 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-2 text-sm ${textSecondary} ${btnHover} rounded-lg border ${inputBorder} transition-colors duration-300`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
