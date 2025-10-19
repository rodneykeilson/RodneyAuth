import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthContainer from '@/components/auth/auth-container';
import { getSession } from '@/lib/session';

export default async function Home() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
      <nav className="absolute top-8 left-0 right-0 flex items-center justify-between px-6 text-foreground">
        <h1 className="text-xl font-bold">RodneyAuth</h1>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-primary transition-colors">
            Password Login
          </Link>
          <Link href="/authenticator" className="hover:text-primary transition-colors">
            Authenticator Login
          </Link>
        </div>
      </nav>
      <AuthContainer />
    </main>
  );
}
