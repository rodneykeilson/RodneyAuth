
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'bioauth-session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  requiresTwoFactor: boolean;
  twoFactorEnabled: boolean;
};

function generateToken() {
  return randomBytes(32).toString('hex');
}

export async function createSession(userId: string) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    await (await cookies()).delete(SESSION_COOKIE);
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } });
    await (await cookies()).delete(SESSION_COOKIE);
    return null;
  }

  const { user } = session;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    requiresTwoFactor: user.requiresTwoFactor,
    twoFactorEnabled: Boolean(user.twoFactorSecret),
  };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookieStore.delete(SESSION_COOKIE);
}
