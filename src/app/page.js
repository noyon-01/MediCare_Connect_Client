// "use client";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Heart,
//   Brain,
//   Bone,
//   Baby,
//   Stethoscope,
//   Eye,
//   Pill,
//   Search,
//   ArrowRight,
//   Star,
//   Shield,
//   Clock,
//   Award,
//   Users,
//   Quote,
// } from "lucide-react";
// import DoctorCard from "@/components/DoctorCard";
// import { authClient } from "@/lib/auth-client";

// const SPECIALIZATIONS = [
//   { icon: Heart, label: "Cardiology", color: "text-red-500" },
//   { icon: Brain, label: "Neurology", color: "text-purple-500" },
//   { icon: Bone, label: "Orthopedics", color: "text-orange-500" },
//   { icon: Baby, label: "Pediatrics", color: "text-pink-500" },
//   { icon: Stethoscope, label: "General Medicine", color: "text-blue-500" },
//   { icon: Eye, label: "Ophthalmology", color: "text-cyan-500" },
// ];

// export default function Home() {
//   const { data: session } = authClient.useSession();
//   const user = session?.user;

//   const [mounted, setMounted] = useState(false);
//   const [stats, setStats] = useState({
//     doctors: 150,
//     patients: 10000,
//     appointments: 2500,
//     reviews: 800,
//   });
//   const [featuredDoctors, setFeaturedDoctors] = useState([]);
//   const [testimonials, setTestimonials] = useState([
//     {
//       _id: "t1",
//       reviewText:
//         "Dr. Jenkins was extremely professional and explained everything in clear detail. Her diagnosis was spot on.",
//       patientName: "John Doe",
//       doctorName: "Dr. Sarah Jenkins (Cardiology)",
//       rating: 5,
//     },
//     {
//       _id: "t2",
//       reviewText:
//         "Excellent neurological consultation. Highly knowledgeable and caring specialist.",
//       patientName: "Alice Smith",
//       doctorName: "Dr. Michael Chang (Neurology)",
//       rating: 5,
//     },
//     {
//       _id: "t3",
//       reviewText:
//         "Great experience at the pediatric clinic. Very friendly staff and child-friendly environment.",
//       patientName: "Robert Johnson",
//       doctorName: "Dr. Emily Rodriguez (Pediatrics)",
//       rating: 5,
//     },
//   ]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setMounted(true);
//     // Fetch statistics
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && !data.error) setStats(data);
//       })
//       .catch(console.error);

//     // Fetch featured/top-rated doctors
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?sortBy=rating&limit=3`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && data.doctors) setFeaturedDoctors(data.doctors);
//       })
//       .catch(console.error);

//     // Fetch testimonials
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?limit=3`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data) && data.length > 0) setTestimonials(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="min-h-screen bg-white">
//       {/* HERO */}
//       <section className="border-b border-gray-200 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 rounded-full px-3 py-1.5 text-xs font-medium mb-6">
//                 <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
//                 Now accepting new patients
//               </span>
//               <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.05]">
//                 Healthcare,
//                 <br />
//                 <span className="text-blue-600">reimagined</span> for everyone.
//               </h1>
//               <p className="mt-5 text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl">
//                 Book appointments with verified specialists, manage your medical
//                 records, and pay securely — all in one quiet, trustworthy place.
//               </p>

//               <div className="mt-8 flex flex-wrap gap-3">
//                 <a
//                   href="/doctors"
//                   className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors"
//                 >
//                   Find a Doctor <ArrowRight className="w-4 h-4" />
//                 </a>
//                 <a
//                   href="/about"
//                   className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium px-5 py-3 rounded-lg transition-colors"
//                 >
//                   How it works
//                 </a>
//               </div>

//               <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
//                 {[
//                   ["Verified", "specialists"],
//                   ["24/7", "support"],
//                   ["Secure", "& private"],
//                 ].map(([k, v]) => (
//                   <div key={k} className="border-l border-gray-200 pl-3">
//                     <p className="text-xs font-semibold text-gray-900">{k}</p>
//                     <p className="text-xs text-gray-500">{v}</p>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.96 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="relative"
//             >
//               <div className="bg-white border border-gray-200 rounded-xl p-6">
//                 <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
//                   <div>
//                     <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
//                       Quick Search
//                     </p>
//                     <h3 className="text-base font-semibold text-gray-900 mt-0.5">
//                       Find a specialist
//                     </h3>
//                   </div>
//                   <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700">
//                     <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
//                     Live
//                   </span>
//                 </div>
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     const q = new FormData(e.target).get("q");
//                     window.location.href = `/doctors?search=${encodeURIComponent(q || "")}`;
//                   }}
//                   className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
//                 >
//                   <Search className="w-4 h-4 text-gray-400" />
//                   <input
//                     name="q"
//                     placeholder="Search by name or specialization…"
//                     className="flex-1 bg-transparent text-sm outline-none"
//                   />
//                   <button
//                     type="submit"
//                     className="text-xs font-medium text-blue-600 hover:text-blue-700"
//                   >
//                     Search
//                   </button>
//                 </form>

//                 <div className="mt-5 grid grid-cols-3 gap-2">
//                   {SPECIALIZATIONS.slice(0, 6).map(
//                     ({ icon: Icon, label, color }) => (
//                       <a
//                         key={label}
//                         href={`/doctors?specialization=${encodeURIComponent(label)}`}
//                         className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors text-center"
//                       >
//                         <Icon className={`w-4 h-4 mx-auto ${color}`} />
//                         <p className="text-[11px] text-gray-700 mt-1.5 truncate">
//                           {label}
//                         </p>
//                       </a>
//                     ),
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* STATS */}
//       <section className="bg-gray-50 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               ["Verified Doctors", stats.doctors ?? 150],
//               ["Patients Served", stats.patients ?? 10000],
//               ["Appointments Booked", stats.appointments ?? 2500],
//               ["Patient Reviews", stats.reviews ?? 800],
//             ].map(([label, value], i) => (
//               <motion.div
//                 key={label}
//                 initial={{ opacity: 0, y: 10 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.06 }}
//                 className="bg-white border border-gray-200 rounded-xl p-5"
//               >
//                 <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                   {label}
//                 </p>
//                 <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
//                   {typeof value === "number" ? value.toLocaleString() : value}
//                   {typeof value === "number" &&
//                     value > 0 &&
//                     label !== "Patient Reviews" &&
//                     "+"}
//                 </p>
//                 <div className="mt-3 inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-0.5 text-[10px] text-gray-700">
//                   <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
//                   Growing
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* SPECIALIZATIONS */}
//       <section className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="flex items-end justify-between mb-8">
//             <div>
//               <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 mb-3">
//                 Browse care areas
//               </span>
//               <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
//                 Medical specializations
//               </h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 Curated care across the most common practice areas.
//               </p>
//             </div>
//             <a
//               href="/doctors"
//               className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
//             >
//               View all <ArrowRight className="w-3.5 h-3.5" />
//             </a>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//             {SPECIALIZATIONS.map(({ icon: Icon, label, color }) => (
//               <a
//                 key={label}
//                 href={`/doctors?specialization=${encodeURIComponent(label)}`}
//                 className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors text-center"
//               >
//                 <div className="w-11 h-11 mx-auto rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-3">
//                   <Icon className={`w-5 h-5 ${color}`} />
//                 </div>
//                 <p className="text-sm font-medium text-gray-900">{label}</p>
//                 <p className="text-xs text-gray-500 mt-0.5">View doctors</p>
//               </a>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FEATURED DOCTORS */}
//       <section className="bg-gray-50 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="flex items-end justify-between mb-8">
//             <div>
//               <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-xs font-medium mb-3">
//                 Top rated
//               </span>
//               <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
//                 Featured doctors
//               </h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 Specialists patients consistently rate the highest.
//               </p>
//             </div>
//             <a
//               href="/doctors"
//               className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
//             >
//               See all doctors <ArrowRight className="w-3.5 h-3.5" />
//             </a>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {featuredDoctors.map((d) => (
//               <DoctorCard key={d._id} doctor={d} />
//             ))}
//             {loading &&
//               Array.from({ length: 3 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="bg-white border border-gray-200 rounded-xl p-5 h-44 animate-pulse"
//                 />
//               ))}
//             {!loading && featuredDoctors.length === 0 && (
//               <p className="text-center col-span-3 text-gray-500 italic py-8">
//                 No doctors found yet. Please seed or register doctors.
//               </p>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* WHY CHOOSE */}
//       <section className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="grid lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-1">
//               <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 mb-3">
//                 Why us
//               </span>
//               <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
//                 A calmer way to manage your health.
//               </h2>
//               <p className="text-sm text-gray-500 mt-3 leading-relaxed">
//                 We obsessed over the small things — verification, security, fair
//                 pricing — so the care that follows feels effortless.
//               </p>
//             </div>
//             <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
//               {[
//                 {
//                   icon: Shield,
//                   title: "Verified by Admin",
//                   desc: "Every doctor goes through a human verification step before going public.",
//                 },
//                 {
//                   icon: Clock,
//                   title: "Real-time slots",
//                   desc: "See live availability without phone-tag or paperwork.",
//                 },
//                 {
//                   icon: Award,
//                   title: "Honest ratings",
//                   desc: "Reviews are tied to confirmed appointments — no fake noise.",
//                 },
//                 {
//                   icon: Users,
//                   title: "Care continuity",
//                   desc: "Your prescriptions, history, and follow-ups all live together.",
//                 },
//               ].map(({ icon: Icon, title, desc }) => (
//                 <div
//                   key={title}
//                   className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
//                 >
//                   <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
//                     <Icon className="w-4 h-4 text-blue-600" />
//                   </div>
//                   <h3 className="text-sm font-semibold text-gray-900">
//                     {title}
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1 leading-relaxed">
//                     {desc}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section className="bg-gray-50 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="mb-8 text-center">
//             <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 mb-3">
//               Patient stories
//             </span>
//             <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
//               From people we've cared for
//             </h2>
//             <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
//               Real reviews from real appointments on MediCare Connect.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {testimonials.map((t, i) => (
//               <motion.div
//                 key={t._id}
//                 initial={{ opacity: 0, y: 10 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.05 }}
//                 className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
//               >
//                 <Quote className="w-5 h-5 text-gray-300" />
//                 <p className="text-sm text-gray-700 mt-3 leading-relaxed line-clamp-4">
//                   "{t.reviewText}"
//                 </p>
//                 <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center">
//                       {(t.patientName || "P")[0]}
//                     </div>
//                     <div>
//                       <p className="text-xs font-semibold text-gray-900">
//                         {t.patientName || "Patient"}
//                       </p>
//                       <p className="text-[10px] text-gray-500">
//                         {t.doctorName}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="inline-flex items-center gap-0.5">
//                     {Array.from({ length: 5 }).map((_, idx) => (
//                       <Star
//                         key={idx}
//                         className={`w-3 h-3 ${
//                           idx < t.rating
//                             ? "text-orange-500 fill-orange-500"
//                             : "text-gray-200"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//             {testimonials.length === 0 && !loading && (
//               <div className="md:col-span-3 text-center py-12 bg-white border border-gray-200 rounded-xl">
//                 <p className="text-sm text-gray-500">
//                   Reviews from your patients will appear here.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="bg-gray-900 rounded-2xl p-10 sm:p-14 relative overflow-hidden">
//             <div className="relative z-10 max-w-2xl">
//               <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white rounded-full px-3 py-1 text-xs font-medium mb-4">
//                 <Pill className="w-3 h-3" />
//                 Ready when you are
//               </span>
//               <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
//                 Your next appointment is a few clicks away.
//               </h2>
//               <p className="text-sm text-gray-400 mt-3 max-w-lg">
//                 Sign up free, browse verified specialists, and book a time that
//                 actually fits your day.
//               </p>
//               <div className="mt-6 flex flex-wrap gap-3">
//                 {mounted && user ? (
//                   <a
//                     href="/dashboard"
//                     className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
//                   >
//                     Go to Dashboard
//                   </a>
//                 ) : (
//                   <a
//                     href="/register"
//                     className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-900 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
//                   >
//                     Create account
//                   </a>
//                 )}
//                 <a
//                   href="/doctors"
//                   className="inline-flex items-center gap-1.5 bg-transparent border border-white/30 hover:bg-white/10 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
//                 >
//                   Browse doctors <ArrowRight className="w-3.5 h-3.5" />
//                 </a>
//               </div>
//             </div>
//             <div
//               className="absolute inset-0 opacity-30"
//               style={{
//                 background:
//                   "radial-gradient(circle at 80% 50%, rgba(37,99,235,0.4) 0%, transparent 50%)",
//               }}
//             />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }









"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Stethoscope,
  Eye,
  Pill,
  Search,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Award,
  Users,
  Quote,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Activity,
  ChevronRight,
  Calendar,
  MessageCircle,
  Video,
  CheckCircle,
} from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import { authClient } from "@/lib/auth-client";

const SPECIALIZATIONS = [
  { icon: Heart, label: "Cardiology", color: "text-rose-500", bg: "bg-rose-50" },
  { icon: Brain, label: "Neurology", color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: Bone, label: "Orthopedics", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Baby, label: "Pediatrics", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Stethoscope, label: "General Medicine", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: Eye, label: "Ophthalmology", color: "text-cyan-500", bg: "bg-cyan-50" },
];

export default function Home() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    doctors: 150,
    patients: 10000,
    appointments: 2500,
    reviews: 800,
  });
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [testimonials, setTestimonials] = useState([
    {
      _id: "t1",
      reviewText:
        "Dr. Jenkins was extremely professional and explained everything in clear detail. Her diagnosis was spot on.",
      patientName: "John Doe",
      doctorName: "Dr. Sarah Jenkins (Cardiology)",
      rating: 5,
    },
    {
      _id: "t2",
      reviewText:
        "Excellent neurological consultation. Highly knowledgeable and caring specialist.",
      patientName: "Alice Smith",
      doctorName: "Dr. Michael Chang (Neurology)",
      rating: 5,
    },
    {
      _id: "t3",
      reviewText:
        "Great experience at the pediatric clinic. Very friendly staff and child-friendly environment.",
      patientName: "Robert Johnson",
      doctorName: "Dr. Emily Rodriguez (Pediatrics)",
      rating: 5,
    },
  ]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  useEffect(() => {
    setMounted(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setStats(data);
      })
      .catch(console.error);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors?sortBy=rating&limit=3`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.doctors) setFeaturedDoctors(data.doctors);
      })
      .catch(console.error);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?limit=3`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setTestimonials(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO SECTION ===== */}
      <motion.section
        style={{ opacity: heroOpacity }}
        className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-rose-500/5 to-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-white/80">Now accepting new patients</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05]"
              >
                Your Health,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400">
                  Our Purpose
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/70 leading-relaxed max-w-lg"
              >
                Experience compassionate care from verified specialists. Book appointments, manage records, and connect with your doctor — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <a
                  href="/doctors"
                  className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-900 font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  Find a Doctor
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium px-7 py-3.5 rounded-full transition-all duration-300"
                >
                  <Video className="w-4 h-4" />
                  Virtual Consult
                </a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-8 pt-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[
                      "https://i.pravatar.cc/32?img=1",
                      "https://i.pravatar.cc/32?img=2",
                      "https://i.pravatar.cc/32?img=3",
                      "https://i.pravatar.cc/32?img=4",
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-white/20"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">10K+ Patients</p>
                    <p className="text-xs text-white/50">Trusted healthcare</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-white/50">4.9/5</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Main Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-white/50 font-medium uppercase tracking-wider">
                      Quick Access
                    </p>
                    <h3 className="text-lg font-semibold text-white mt-0.5">
                      What would you like to do?
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/20 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-medium">Live</span>
                  </span>
                </div>

                {/* Quick Search */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = new FormData(e.target).get("q");
                    window.location.href = `/doctors?search=${encodeURIComponent(q || "")}`;
                  }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-white/30 transition-colors"
                >
                  <Search className="w-4 h-4 text-white/40" />
                  <input
                    name="q"
                    placeholder="Search doctors, specialties..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
                  />
                  <button
                    type="submit"
                    className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
                  >
                    Search
                  </button>
                </form>

                {/* Specializations Grid */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {SPECIALIZATIONS.slice(0, 6).map(({ icon: Icon, label, color, bg }) => (
                    <motion.a
                      key={label}
                      href={`/doctors?specialization=${encodeURIComponent(label)}`}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 text-center transition-all duration-300"
                    >
                      <div className={`w-8 h-8 mx-auto rounded-full ${bg} flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <p className="text-[10px] text-white/70 truncate group-hover:text-white transition-colors">
                        {label}
                      </p>
                    </motion.a>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <a href="/doctors" className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1">
                    View all specialties
                    <ChevronRight className="w-3 h-3" />
                  </a>
                  <a
                    href={user ? "/dashboard" : "/register"}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                  >
                    {user ? "Dashboard" : "Get Started"}
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Users, label: "Doctors", value: stats.doctors || 150 },
                  { icon: Calendar, label: "Appointments", value: stats.appointments || 2500 },
                  { icon: Star, label: "Reviews", value: stats.reviews || 800 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center"
                  >
                    <item.icon className="w-4 h-4 text-white/40 mx-auto" />
                    <p className="text-lg font-bold text-white mt-1">
                      {typeof item.value === "number" ? item.value.toLocaleString() : item.value}+
                    </p>
                    <p className="text-[10px] text-white/40">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== SPECIALIZATIONS SECTION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-xs font-medium mb-4">
              <Stethoscope className="w-3 h-3" />
              Our Specialties
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Expert Care in Every Specialty
            </h2>
            <p className="text-lg text-slate-500 mt-3">
              From routine check-ups to complex procedures, we've got you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SPECIALIZATIONS.map(({ icon: Icon, label, color, bg }, i) => (
              <motion.a
                key={label}
                href={`/doctors?specialization=${encodeURIComponent(label)}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group bg-slate-50 hover:bg-white rounded-2xl p-6 text-center transition-all duration-300 border-2 border-transparent hover:border-blue-100 hover:shadow-xl"
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">View doctors</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["👨‍⚕️", "Expert Doctors", stats.doctors || 150, "Top specialists"],
              ["❤️", "Happy Patients", stats.patients || 10000, "Cared for"],
              ["📅", "Appointments", stats.appointments || 2500, "Booked"],
              ["⭐", "Reviews", stats.reviews || 800, "4.9/5 average"],
            ].map(([emoji, label, value, sub], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <span className="text-3xl">{emoji}</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {typeof value === "number" ? value.toLocaleString() : value}+
                </p>
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DOCTORS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 rounded-full px-4 py-1.5 text-xs font-medium mb-3">
                <Award className="w-3 h-3" />
                Top Rated
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Meet Our Expert Doctors
              </h2>
              <p className="text-lg text-slate-500 mt-1">
                Trusted by thousands for their expertise and care.
              </p>
            </div>
            <a
              href="/doctors"
              className="hidden sm:inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDoctors.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <DoctorCard doctor={d} />
              </motion.div>
            ))}
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-6 h-64 animate-pulse"
                />
              ))}
            {!loading && featuredDoctors.length === 0 && (
              <div className="col-span-3 text-center py-12 bg-slate-50 rounded-2xl">
                <p className="text-slate-500">No doctors found yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 rounded-full px-4 py-1.5 text-xs font-medium mb-4">
              <Shield className="w-3 h-3" />
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Healthcare That Puts You First
            </h2>
            <p className="text-lg text-slate-500 mt-3">
              We're redefining healthcare with technology, trust, and compassion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Verified Doctors",
                desc: "Every specialist is thoroughly verified before joining our platform.",
                color: "blue",
              },
              {
                icon: Clock,
                title: "24/7 Access",
                desc: "Book appointments anytime, anywhere with real-time availability.",
                color: "emerald",
              },
              {
                icon: MessageCircle,
                title: "Secure Chat",
                desc: "Communicate with your doctor through our secure messaging system.",
                color: "purple",
              },
              {
                icon: Video,
                title: "Video Consult",
                desc: "Connect with specialists from the comfort of your home.",
                color: "rose",
              },
            ].map(({ icon: Icon, title, desc, color }, i) => {
              const colors = {
                blue: "bg-blue-50 text-blue-600",
                emerald: "bg-emerald-50 text-emerald-600",
                purple: "bg-purple-50 text-purple-600",
                rose: "bg-rose-50 text-rose-600",
              };
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
                >
                  <div className={`w-14 h-14 mx-auto rounded-2xl ${colors[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 rounded-full px-4 py-1.5 text-xs font-medium mb-4">
              <Quote className="w-3 h-3" />
              Patient Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Real Stories from Real Patients
            </h2>
            <p className="text-lg text-slate-500 mt-3">
              Hear what our patients have to say about their experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${idx < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  "{t.reviewText}"
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center">
                    {(t.patientName || "P")[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t.patientName || "Patient"}
                    </p>
                    <p className="text-xs text-slate-400">{t.doctorName}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {testimonials.length === 0 && !loading && (
              <div className="col-span-3 text-center py-12 bg-slate-50 rounded-2xl">
                <p className="text-slate-500">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 p-12 sm:p-16 text-center"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
              <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-40 w-48 h-48 bg-amber-400 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-1.5 text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                Start Your Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to Take Charge of Your Health?
              </h2>
              <p className="text-lg text-white/80 mt-3 max-w-xl mx-auto">
                Join thousands of patients who trust us for their healthcare needs.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-8">
                {mounted && user ? (
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-900 font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href="/register"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-900 font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
                <a
                  href="/doctors"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium px-8 py-3.5 rounded-full transition-all duration-300"
                >
                  Browse Doctors
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}