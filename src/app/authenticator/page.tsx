import Link from 'next/link';
import AuthenticatorLoginPanel from '@/components/auth/authenticator-login-panel';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

type AuthenticatorPageProps = {
  searchParams?: { email?: string };
};

export default async function AuthenticatorPage({ searchParams }: AuthenticatorPageProps) {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  const defaultEmail = searchParams?.email;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Authenticator Login</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code from your authenticator app to continue.
          </p>
        </div>
        <div className="rounded-lg border bg-card shadow-xl p-6 space-y-6">
          <AuthenticatorLoginPanel defaultEmail={defaultEmail} />
          <p className="text-sm text-muted-foreground text-center">
            Prefer password login?{' '}
            <Link href="/" className="font-medium text-primary hover:underline">
              Go back to standard sign-in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
