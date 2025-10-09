
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoginPanel from './login-panel';
import RegisterPanel from './register-panel';

type AuthMode = 'login' | 'register';

export default function AuthContainer() {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleRegisterSuccess = () => {
    setMode('login');
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl bg-card overflow-hidden">
      {mode === 'login' ? (
        <>
          <CardHeader className="text-center p-6">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <LoginPanel />
          </CardContent>
          <CardFooter className="flex-col gap-4 p-6 bg-muted/50">
            <div className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => setMode('register')}>
                Sign up
              </Button>
            </div>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader className="text-center p-6">
            <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
            <CardDescription>Get started with secure authentication.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <RegisterPanel onRegisterSuccess={handleRegisterSuccess} />
          </CardContent>
          <CardFooter className="flex-col gap-4 p-6 bg-muted/50">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => setMode('login')}>
                Sign in
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
