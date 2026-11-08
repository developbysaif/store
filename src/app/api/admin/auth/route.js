import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  requireAdminAuth,
  DEFAULT_ADMIN_EMAIL,
} from "@/lib/security/auth";
import { checkRateLimit, RateLimitPresets } from "@/lib/security/rate-limit";
import { adminLoginSchema } from "@/lib/security/validation";

/**
 * GET /api/admin/auth — Check current admin session
 */
export async function GET(request) {
  try {
    const session = await requireAdminAuth(request);
    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false, message: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        email: session.email,
        role: session.role,
        name: session.name,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/auth — Login and Logout handlers
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const action = body.action || "login";

    // 1. Handle Logout
    if (action === "logout") {
      const response = NextResponse.json({
        success: true,
        message: "Admin session terminated successfully",
      });
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: "",
        path: "/",
        httpOnly: true,
        maxAge: 0,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return response;
    }

    // 2. Handle Login
    // Rate limit check to prevent brute-force dictionary attacks
    const rateLimit = checkRateLimit(request, RateLimitPresets.ADMIN_LOGIN, "admin-login");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed sign-in attempts. Access suspended for 15 minutes.",
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    // Input validation
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid email or password format",
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const isValid = verifyAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid administrative credentials. Security incident logged.",
          remainingAttempts: rateLimit.remaining,
        },
        { status: 401 }
      );
    }

    // Generate signed HMAC-SHA256 session token
    const token = createSessionToken({
      email: DEFAULT_ADMIN_EMAIL,
      role: "ADMIN",
      name: "Saif (Super Director)",
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        email: DEFAULT_ADMIN_EMAIL,
        role: "ADMIN",
        name: "Saif (Super Director)",
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      path: "/",
      httpOnly: true,
      maxAge: SESSION_MAX_AGE_SECONDS,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
