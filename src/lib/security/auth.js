import crypto from "crypto";

// Session configuration
const SESSION_COOKIE_NAME = "atelier_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

// Secret key for HMAC signing (uses environment variable if provided, fallback to stable derivation)
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.DATABASE_URL || "maison-atelier-security-secret-key-2026";

// Default admin credentials (configurable via environment variables)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@maisonatelier.com";
// Default password: "AdminPassword2026!"
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AdminPassword2026!";

/**
 * Hash a password using crypto.scrypt (NIST SP 800-132 compliant, GPU-resistant memory-hard function)
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a password against a stored salt:hash using constant-time comparison
 */
export function verifyPassword(password, storedHash) {
  try {
    if (!storedHash || !storedHash.includes(":")) return false;
    const [salt, key] = storedHash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
}

// Pre-computed hash of default password for instant matching without plaintext storage in memory
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || hashPassword(DEFAULT_ADMIN_PASSWORD);

/**
 * Verify admin credentials
 */
export function verifyAdminCredentials(email, password) {
  if (!email || !password) return false;
  const normalizedEmail = email.trim().toLowerCase();
  const targetEmail = DEFAULT_ADMIN_EMAIL.toLowerCase();

  if (normalizedEmail !== targetEmail) return false;
  return verifyPassword(password, ADMIN_PASSWORD_HASH);
}

/**
 * Generate a signed session token
 */
export function createSessionToken(payload) {
  const data = {
    ...payload,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    nonce: crypto.randomBytes(8).toString("hex"),
  };

  const encodedData = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(encodedData)
    .digest("base64url");

  return `${encodedData}.${signature}`;
}

/**
 * Verify and decode a session token
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [encodedData, signature] = token.split(".");
  if (!encodedData || !signature) return null;

  // Verify HMAC signature in constant time
  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(encodedData)
    .digest("base64url");

  try {
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    const data = JSON.parse(Buffer.from(encodedData, "base64url").toString("utf8"));

    // Check expiration
    if (!data.expiresAt || Date.now() > data.expiresAt) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Extract and verify admin session from Request or Next.js Cookies
 */
export async function getAdminSessionFromCookies() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;
    return verifySessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * Helper to check admin authentication in API route handlers
 * Returns session if valid, throws/returns 401 response if invalid
 */
export async function requireAdminAuth(request) {
  // Check authorization header first (Bearer token)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const session = verifySessionToken(token);
    if (session && session.role === "ADMIN") return session;
  }

  // Check cookie next
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookiesList = cookieHeader.split(";").map((c) => c.trim());
    const sessionPair = cookiesList.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (sessionPair) {
      const token = sessionPair.substring(`${SESSION_COOKIE_NAME}=`.length);
      const session = verifySessionToken(token);
      if (session && session.role === "ADMIN") return session;
    }
  }

  // Next.js cookies fallback
  const session = await getAdminSessionFromCookies();
  if (session && session.role === "ADMIN") return session;

  return null;
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, DEFAULT_ADMIN_EMAIL };
