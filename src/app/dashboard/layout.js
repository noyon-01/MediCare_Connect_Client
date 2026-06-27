import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { MongoClient, ObjectId } from "mongodb";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role || "patient";
  let isVerifiedDoctor = false;

  if (role === "doctor") {
    const client = new MongoClient(process.env.MongoDB_URI);
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
      if (profile && profile.verificationStatus === "verified") {
        isVerifiedDoctor = true;
      }
    } catch (err) {
      console.error("DashboardLayout verification check failed:", err);
    } finally {
      await client.close();
    }
  }

  return (
    <div className="in-dashboard flex flex-col lg:flex-row min-h-screen bg-gray-50 text-gray-900">
      <DashboardSidebar user={session.user} role={role} isVerifiedDoctor={isVerifiedDoctor} />
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
