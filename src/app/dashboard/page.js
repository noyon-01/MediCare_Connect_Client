import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MongoClient, ObjectId } from "mongodb";

export default async function DashboardPage(props) {
  const searchParams = await props.searchParams;
  const registerRole = searchParams?.register_role;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  let role = session.user.role || "patient";

  if (registerRole && (registerRole === "doctor" || registerRole === "patient") && session.user.role !== registerRole) {
    const client = new MongoClient(process.env.MongoDB_URI);
    try {
      await client.connect();
      const db = client.db("medicareconnect");
      const userDb = db.collection("user");
      
      const newStatus = registerRole === "doctor" ? "pending" : "active";
      await userDb.updateOne(
        { _id: new ObjectId(session.user.id) },
        { $set: { role: registerRole, status: newStatus } }
      );
      role = registerRole;
    } catch (err) {
      console.error("Failed to update user role during dashboard redirection:", err);
    } finally {
      await client.close();
    }
  }

  redirect(`/dashboard/${role}`);
}
