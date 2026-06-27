import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MongoClient, ObjectId } from "mongodb";
import { Clock, XCircle } from "lucide-react";
import Link from "next/link";

export default async function DoctorDashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Double check that user is actually a doctor
  if (session.user.role !== "doctor") {
    redirect("/dashboard");
  }

  const client = new MongoClient(process.env.MongoDB_URI);
  let status = "not_found";

  try {
    await client.connect();
    const db = client.db("medicareconnect");

    let userIdQuery = session.user.id;
    let userObjectId = null;
    try {
      userObjectId = new ObjectId(session.user.id);
    } catch (e) {}

    const query = userObjectId
      ? { $or: [{ userId: session.user.id }, { userId: userObjectId }] }
      : { userId: session.user.id };

    const profile = await db.collection("doctors").findOne(query);
    if (profile) {
      status = profile.verificationStatus || "pending";
    }
  } catch (err) {
    console.error(
      "DoctorDashboardLayout verification status check failed:",
      err,
    );
  } finally {
    await client.close();
  }

  // If the doctor has registered a profile but is unverified (pending or rejected), block access and show status screen
  if (status !== "verified" && status !== "not_found") {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm space-y-6">
          {status === "pending" ? (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mx-auto">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Awaiting Verification
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your professional profile has been submitted and is currently
                  pending verification by site administrators. Once verified,
                  you will gain full access to your scheduling and dashboard
                  tools.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 mx-auto">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Verification Rejected
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your professional verification has been rejected or revoked by
                  the site administrator. If you believe this is an error or
                  need to update your credentials, please contact support.
                </p>
              </div>
            </>
          )}
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              Go back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
