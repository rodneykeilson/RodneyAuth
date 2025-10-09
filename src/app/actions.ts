
'use server';

import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';
import { authenticator } from 'otplib';
import { findUserByEmail } from '@/lib/user-store';

export async function login(method: string, email?: string, code?: string) {
  let user;

  if (method === 'authenticator') {
    if (!email || !code) {
      throw new Error('Email and code must be provided for authenticator login.');
    }
    user = await findUserByEmail(email);

    if (!user || !user.authenticatorSecret) {
      throw new Error('Authenticator not set up for this user or user not found.');
    }

    const isValid = authenticator.check(code, user.authenticatorSecret);
    if (!isValid) {
      throw new Error('Invalid authenticator code.');
    }
  } else {
    throw new Error('Invalid authentication method.');
  }

  await createSession({ 
    userId: user.id, 
    name: user.name, 
    authenticatorSecret: user.authenticatorSecret
  });

  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/');
}
