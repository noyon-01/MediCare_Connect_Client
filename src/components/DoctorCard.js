import { Star, MapPin, Briefcase } from "lucide-react";

export default function DoctorCard({ doctor }) {
  const rating = Number(doctor.rating || 0).toFixed(1);
  return (
    <a
      href={`/doctors/${doctor._id}`}
      className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
          {doctor.profileImage ? (
            <img
              src={doctor.profileImage}
              alt={doctor.doctorName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b' font-weight='bold'>Dr.</text></svg>";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold bg-gray-50">
              {(doctor.doctorName || "D")[0]}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {doctor.doctorName}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {doctor.specialization}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[11px] font-medium text-gray-700 whitespace-nowrap">
              <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
              {rating}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-[11px] text-gray-700">
          <Briefcase className="w-3 h-3 text-gray-400" />
          {doctor.experience}+ yrs
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-[11px] text-gray-700 truncate">
          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="truncate">{doctor.hospitalName || "—"}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
            Consultation
          </p>
          <p className="text-base font-semibold text-gray-900">
            ${Number(doctor.consultationFee).toFixed(0)}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 rounded-full px-3 py-1.5 text-xs font-medium group-hover:bg-blue-100 transition-colors">
          Book →
        </span>
      </div>
    </a>
  );
}
