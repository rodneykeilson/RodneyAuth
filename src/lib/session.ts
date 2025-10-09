
import { cookies } from 'next/headers';

const cookieName = 'bioauth-session';

type SessionData = {
  userId: string;
  name: string;
  authenticatorSecret?: string;
};

export async function createSession(user: SessionData) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = JSON.stringify(user);

  (await cookies()).set(cookieName, session, {
    expires,
    httpOnly: true,
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const sessionCookie = (await cookies()).get(cookieName)?.value;
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie);
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(cookieName);
}
