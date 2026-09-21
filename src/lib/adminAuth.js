
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// ==========================================
// GET ADMIN FROM COOKIE
// ==========================================
// This function checks whether an admin is
// authenticated using the JWT stored inside
// the "token" HTTP-only cookie.
//
// Returns:
//   - decoded admin data → if authenticated
//   - null               → if not authenticated
// ==========================================

export async function getAdminFromCookie() {
  try {
    // ==========================================
    // 1. GET COOKIE STORE
    // ==========================================
    // Next.js provides the cookies() function
    // to read cookies from the incoming request.
    //
    // cookies() is async in the current Next.js
    // version, so we use await.
    // ==========================================

    const cookieStore = await cookies();

    // ==========================================
    // 2. GET JWT TOKEN FROM COOKIE
    // ==========================================
    // Our admin login stores the JWT inside
    // a cookie named "token".
    //
    // Example:
    // token = "eyJhbGciOiJIUzI1NiIs..."
    // ==========================================

    const token = cookieStore.get("token")?.value;

    // ==========================================
    // 3. CHECK WHETHER TOKEN EXISTS
    // ==========================================
    // If there is no token, the user is not
    // authenticated as an admin.
    // ==========================================

    if (!token) {
      return null;
    }

    // ==========================================
    // 4. CHECK JWT SECRET
    // ==========================================
    // JWT_SECRET is required to verify that the
    // token was actually created by our server.
    //
    // It should be stored in:
    // .env.local
    //
    // Example:
    // JWT_SECRET=your-secret-key
    // ==========================================

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    // ==========================================
    // 5. VERIFY JWT TOKEN
    // ==========================================
    // jwt.verify() checks:
    //
    // - Is the token valid?
    // - Was it signed using our JWT_SECRET?
    // - Has it expired?
    //
    // If everything is valid, it returns the
    // decoded payload.
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==========================================
    // 6. CHECK ADMIN ROLE
    // ==========================================
    // We only want admins to pass this
    // authentication check.
    //
    // Example decoded token:
    //
    // {
    //   id: "...",
    //   email: "...",
    //   role: "admin"
    // }
    //
    // If the role is not "admin", reject it.
    // ==========================================

    if (decoded.role !== "admin") {
      return null;
    }

    // ==========================================
    // 7. RETURN ADMIN INFORMATION
    // ==========================================
    // At this point:
    //
    // - token exists
    // - JWT_SECRET exists
    // - JWT is valid
    // - role is admin
    //
    // So we return the decoded admin data.
    // ==========================================

    return decoded;

  } catch (error) {

    // ==========================================
    // 8. HANDLE AUTHENTICATION ERRORS
    // ==========================================
    // Possible errors:
    //
    // - Invalid JWT
    // - Expired JWT
    // - Missing JWT_SECRET
    // - Other authentication errors
    //
    // Returning null means the user is not
    // authenticated as an admin.
    // ==========================================

    console.error(
      "Admin authentication error:",
      error
    );

    return null;
  }
}

