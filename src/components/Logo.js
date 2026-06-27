export default function Logo({ size = "md", showText = true }) {
  const dim = size === "sm" ? 28 : size === "lg" ? 40 : 32;
  return (
    <div className="inline-flex items-center gap-2">
      <div
        className="rounded-lg bg-blue-600 flex items-center justify-center text-white"
        style={{ width: dim, height: dim }}
      >
        <svg
          width={dim * 0.55}
          height={dim * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </div>
      {showText && (
        <span className="font-semibold tracking-tight text-gray-900 text-base">
          MediCare<span className="text-blue-600"> Connect</span>
        </span>
      )}
    </div>
  );
}
