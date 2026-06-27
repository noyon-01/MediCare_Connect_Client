import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await auth.api.signUpEmail({
      body: {
        email: "admin@medicare.com",
        password: "AdminPassword123!",
        name: "Site Administrator",
        role: "admin",
        status: "active"
      }
    });
    return NextResponse.json({ 
      success: true, 
      message: "Admin seeded successfully!", 
      email: "admin@medicare.com",
      password: "AdminPassword123!",
      user 
    });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Admin already seeded or creation failed" 
    });
  }
}
