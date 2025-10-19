
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authenticator } from 'otplib';
import {
  authenticateWithPassword,
  findUserByEmail,
  setTwoFactorRequirement,
  updateUserPassword,
  updateUserRole,
} from '@/lib/user-store';
import { createSession, deleteSession, getSession } from '@/lib/session';

export async function loginWithPassword(email: string, password: string) {
  const user = await authenticateWithPassword(email, password);

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  if (user.requiresTwoFactor && user.twoFactorSecret) {
    redirect(`/authenticator?email=${encodeURIComponent(email)}`);
  }

  await createSession(user.id);
  redirect('/dashboard');
}

export async function loginWithAuthenticator(email: string, code: string) {
  const user = await findUserByEmail(email);

  if (!user || !user.twoFactorSecret) {
    throw new Error('Authenticator not set up for this user or user not found.');
  }

  const isValid = authenticator.check(code, user.twoFactorSecret);
  if (!isValid) {
    throw new Error('Invalid authenticator code.');
  }

  await createSession(user.id);
  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/');
}

export async function updateUserRoleAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Not authorized to update user roles.');
  }

  const userId = String(formData.get('userId') ?? '');
  const role = formData.get('role');

  if (!userId || (role !== 'ADMIN' && role !== 'MANAGER' && role !== 'MEMBER')) {
    throw new Error('Invalid form submission.');
  }

  await updateUserRole(userId, role);
  revalidatePath('/admin/users');
}

export async function toggleTwoFactorRequirementAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Not authorized to update two-factor settings.');
  }

  const userId = String(formData.get('userId') ?? '');
  const requires = formData.get('requires') === 'true';

  if (!userId) {
    throw new Error('Invalid form submission.');
  }

  await setTwoFactorRequirement(userId, requires);
  revalidatePath('/admin/users');
}

export async function updateUserPasswordAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Not authorized to update passwords.');
  }

  const userId = String(formData.get('userId') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!userId || password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  await updateUserPassword(userId, password);
  revalidatePath('/admin/users');
}
