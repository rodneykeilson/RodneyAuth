import AuthContainer from '@/components/auth/auth-container';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
      <div className="absolute top-8 left-8 flex items-center gap-2 text-foreground">
        <h1 className="text-xl font-bold">RodneyAuth</h1>
      </div>
      <AuthContainer />
    </main>
  );
}
