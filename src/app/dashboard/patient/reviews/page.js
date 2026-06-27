"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Star, Edit2, Trash2, Plus } from "lucide-react";

export default function PatientReviews() {
  const { data: session } = authClient.useSession();
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [editingReview, setEditingReview] = useState(null);
  const [addingReview, setAddingReview] = useState(false);

  const fetchData = () => {
    if (!session?.user?.id) return;
    
    const appPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-appointments?patientId=${session.user.id}`)
      .then(res => res.json());

    const revPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?patientId=${session.user.id}`)
      .then(res => res.json());

    Promise.all([appPromise, revPromise])
      .then(([apps, revs]) => {
        setAppointments(apps);
        setReviews(revs);
        setLoading(false);
      })
      .catch(err => {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`, {
        method: "DELETE"
      });
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
    if (app.doctorId && !acc.some(d => d.doctorId === app.doctorId)) {
      acc.push({ doctorId: app.doctorId, doctorName: app.doctorName });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Manage reviews and ratings you left for our doctors.</p>
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
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Star className="w-8 h-8 mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-900">No reviews yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Share your experience after a visit to help others choose well.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {r.doctorName}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating
                              ? "text-orange-500 fill-orange-500"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                  </span>
                </div>
                {r.reviewText && (
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed italic">
                    "{r.reviewText}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => setEditingReview(r)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 text-xs text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
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
        />
      )}
    </div>
  );
}

function ReviewModal({ review, visitedDoctors, onClose, onSaved, patientId, patientName }) {
  const [rating, setRating] = useState(review?.rating || 5);
  const [reviewText, setReviewText] = useState(review?.reviewText || "");
  const [doctorId, setDoctorId] = useState(review?.doctorId || visitedDoctors[0]?.doctorId || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review && !doctorId) {
      toast.error("Please select a doctor to review.");
      return;
    }

    const doctorName = review ? review.doctorName : (visitedDoctors.find(d => d.doctorId === doctorId)?.doctorName || "Doctor");

    try {
      if (review) {
        // Update review
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${review._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: parseInt(rating),
            reviewText
          })
        });
        const data = await res.json();
        if (data.modifiedCount > 0) {
          toast.success("Review updated successfully!");
          onSaved();
        } else {
          toast.error("Failed to update review.");
        }
      } else {
        // Create review
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId,
            patientName,
            doctorId,
            doctorName,
            rating: parseInt(rating),
            reviewText
          })
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
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-gray-200 rounded-xl p-6 max-w-sm w-full shadow-xl"
      >
        <h3 className="text-base font-semibold text-gray-900">
          {review ? "Edit review" : "Write a review"}
        </h3>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {!review && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Doctor
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} onClick={() => setRating(i + 1)} type="button">
                  <Star
                    className={`w-6 h-6 ${
                      i < rating
                        ? "text-orange-500 fill-orange-500"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Your review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Share your experience…"
              required
            />
          </div>
          <div className="mt-5 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
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
