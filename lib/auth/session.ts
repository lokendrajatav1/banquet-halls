import { cookies } from "next/headers";
import { SessionData } from "@/lib/types";
import { SESSION_CONFIG } from "@/lib/constants";

/**
 * Create a session cookie
 */
export async function createSession(sessionData: SessionData): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_CONFIG.cookieName, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_CONFIG.maxAge,
    path: "/",
  });
}

/**
 * Get session from cookies
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_CONFIG.cookieName);
  
  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session: SessionData = JSON.parse(sessionCookie.value);
    
    // Check if session has expired
    if (session.expiresAt < Date.now()) {
      await deleteSession();
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

/**
 * Delete session cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONFIG.cookieName);
}

/**
 * Update session expiry
 */
export async function refreshSession(): Promise<void> {
  const session = await getSession();
  if (session) {
    session.expiresAt = Date.now() + SESSION_CONFIG.expiryTime;
    await createSession(session);
  }
}
