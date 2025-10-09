
'use server';

import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { createSession } from '@/lib/session';
import { createUser, findUserByEmail } from '@/lib/user-store';

const SERVICE_NAME = 'RodneyAuth';

export async function generateAuthenticatorSecret(email: string, name: string) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, SERVICE_NAME, secret);

  const qrCode = await qrcode.toDataURL(otpauth);
  
  return { secret, qrCode };
}

export async function verifyAuthenticatorCode({ code, secret, name, email }: { code: string, secret: string, name: string, email: string }) {
  const isValid = authenticator.check(code, secret);

  if (isValid) {
    let user = await findUserByEmail(email);
    if (!user) {
        user = await createUser({
            email,
            name,
            authenticatorSecret: secret,
        });
    }

    await createSession({
      userId: user.id,
      name: user.name,
      authenticatorSecret: secret,
    });
  }
  
  return isValid;
}
