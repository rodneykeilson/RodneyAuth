import { redirect } from 'next/navigation';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSession } from '@/lib/session';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header session={session} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {session.name}</h1>
              <p className="text-muted-foreground">Role: {session.role}</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/authenticator">Authenticator login menu</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account overview</CardTitle>
                <CardDescription>Your profile and security snapshot.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{session.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Two-factor status</span>
                  <span className="font-medium">
                    {session.twoFactorEnabled ? 'Enabled' : 'Pending setup'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Two-factor required</span>
                  <span className="font-medium">{session.requiresTwoFactor ? 'Yes' : 'Optional'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security guidance</CardTitle>
                <CardDescription>Manage authenticator access and recovery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Store your authenticator codes safely. If you lose access, contact an
                  administrator to reset your two-factor secret.
                </p>
                <p>
                  Need to sign in on another device? Use the Authenticator Login menu for a
                  code-only flow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
