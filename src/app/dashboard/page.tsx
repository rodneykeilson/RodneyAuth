import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header userName={session.name} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <Card className="overflow-hidden">
                <CardHeader>
                    <CardTitle>Welcome, {session.name}!</CardTitle>
                    <CardDescription>You are securely logged in to your account.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center space-y-4 pt-8 pb-12 bg-muted/30">
                    <QrCode className="w-16 h-16 text-primary" />
                    <p className="text-muted-foreground">Authenticated via</p>
                    <p className="text-xl font-semibold text-foreground">Authenticator App</p>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
