"use client";

import { useState } from 'react';
import { QrCode, Loader2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { loginWithAuthenticator } from '@/app/actions';

type Props = {
  defaultEmail?: string;
};

export default function AuthenticatorLoginPanel({ defaultEmail }: Props) {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const code = formData.get('code') as string;

    try {
      await loginWithAuthenticator(email, code);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Unable to sign in with authenticator.';

      toast({
        variant: 'destructive',
        title: 'Authenticator Sign-in Failed',
        description: message,
      });
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={defaultEmail}
          required
          className="pl-10"
        />
      </div>
      <Input
        id="code"
        name="code"
        type="text"
        inputMode="numeric"
        maxLength={6}
        autoComplete="one-time-code"
        required
        placeholder="123456"
        className="text-center text-lg tracking-widest"
      />
      <Button type="submit" className="w-full h-12" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : (
          <span className="flex items-center justify-center gap-2">
            <QrCode className="h-5 w-5" />
            Sign In with Authenticator
          </span>
        )}
      </Button>
    </form>
  );
}
