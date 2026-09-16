import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getAdminFromCookie() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

      // =========================
    // JWT SECRET
    // =========================
    
      if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Admin authentication error:", error);
    return null;
  }
}