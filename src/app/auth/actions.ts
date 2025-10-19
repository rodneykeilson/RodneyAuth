
'use server';

import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { createSession } from '@/lib/session';
import { createUser, findUserByEmail } from '@/lib/user-store';

const SERVICE_NAME = 'RodneyAuth';

export async function generateAuthenticatorSecret(email: string) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, SERVICE_NAME, secret);

  const qrCode = await qrcode.toDataURL(otpauth);

  return { secret, qrCode };
}

export async function completeRegistration(params: {
  email: string;
  name: string;
  password: string;
  secret?: string | null;
  code?: string | null;
}) {
  const { email, name, password, secret, code } = params;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  let verifiedSecret: string | null = null;

  if (secret && code) {
    const isValid = authenticator.check(code, secret);
    if (!isValid) {
      throw new Error('Invalid authenticator code.');
    }
    verifiedSecret = secret;
  }

  const user = await createUser({
    email,
    name,
    password,
    twoFactorSecret: verifiedSecret,
    requiresTwoFactor: false,
  });

  await createSession(user.id);
  return { twoFactorEnabled: Boolean(verifiedSecret) };
}

