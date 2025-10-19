"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Loader2, AlertCircle, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { completeRegistration, generateAuthenticatorSecret } from '@/app/auth/actions';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

type RegistrationDetails = {
  email: string;
  name: string;
  password: string;
};

function AuthenticatorSetup({
  onComplete,
  userDetails,
}: {
  onComplete: (code: string, secret: string) => Promise<void>;
  userDetails: RegistrationDetails & { secret?: string; qrCode?: string };
}) {
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (!userDetails.secret || !userDetails.qrCode) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Could not generate an authenticator secret.</AlertDescription>
      </Alert>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setCodeError(null);

    const formData = new FormData(event.currentTarget);
    const code = (formData.get('code') as string).trim();

    try {
      await onComplete(code, userDetails.secret!);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Could not verify the authenticator code. Please try again.';
      setCodeError(message);
      setIsPending(false);
    }
  };

  return (
    <DialogHeader>
      <DialogTitle className="text-center">Set up Authenticator App</DialogTitle>
      <DialogDescription className="text-center space-y-4">
        <p>Scan this QR code with your authenticator app (e.g., Google Authenticator).</p>
        <div className="flex justify-center p-4 bg-white rounded-lg">
          <Image src={userDetails.qrCode!} alt="QR Code" width={200} height={200} />
        </div>
        <p>Then enter the 6-digit code to verify.</p>
      </DialogDescription>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <Input
          name="code"
          placeholder="123456"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          className="text-center text-lg tracking-widest"
        />
        {codeError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification failed</AlertTitle>
            <AlertDescription>{codeError}</AlertDescription>
          </Alert>
        ) : null}
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : 'Verify & Finish'}
        </Button>
      </form>
    </DialogHeader>
  );
}

export default function RegisterPanel({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const [userDetails, setUserDetails] = useState<RegistrationDetails & { secret?: string; qrCode?: string }>(
    {
      email: '',
      name: '',
      password: '',
    }
  );
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;

    if (!enableTwoFactor) {
      try {
        await completeRegistration({ email, name, password });
        toast({
          title: 'Registration Successful',
          description: 'Your account is ready. You are now signed in.',
          className: 'border-primary',
        });
        setStep(1);
        onRegisterSuccess();
        router.push('/dashboard');
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : 'Could not complete registration. Please try again.';
        toast({
          title: 'Registration failed',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setIsPending(false);
      }

      return;
    }

    try {
      const setup = await generateAuthenticatorSecret(email);
      setUserDetails({ email, name, password, ...setup });
      setStep(2);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Could not start registration. Please try again.';
      toast({
        title: 'Registration failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleSetupComplete = async (code: string, secret: string) => {
    await completeRegistration({
      email: userDetails.email,
      name: userDetails.name,
      password: userDetails.password,
      code,
      secret,
    });

    toast({
      title: 'Registration Successful',
      description: 'Your account is ready. You are now signed in.',
      className: 'border-primary',
    });
    setStep(1);
    onRegisterSuccess();
    router.push('/dashboard');
  };

  const handleSkipSetup = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      await completeRegistration({
        email: userDetails.email,
        name: userDetails.name,
        password: userDetails.password,
      });

      toast({
        title: 'Registration Successful',
        description: 'Your account is ready. You are now signed in.',
        className: 'border-primary',
      });
      setEnableTwoFactor(false);
      setStep(1);
      onRegisterSuccess();
      router.push('/dashboard');
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Could not complete registration without authenticator. Please try again.';
      toast({
        title: 'Registration failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  const submitLabel = enableTwoFactor ? 'Continue to Authenticator Setup' : 'Create account';

  return (
    <>
      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="email" name="email" type="email" placeholder="Email" required className="pl-10" />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="name" name="name" type="text" placeholder="Full Name" required className="pl-10" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input id="password" name="password" type="password" placeholder="Password" required className="pl-10" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border border-dashed border-muted-foreground/30 p-3">
          <div className="space-y-1">
            <Label htmlFor="twofactor" className="text-sm">
              Authenticator app (optional)
            </Label>
            <p className="text-xs text-muted-foreground max-w-xs">
              Enable now to scan a QR code and use code-only sign-in. You can always set this up later.
            </p>
          </div>
          <input
            id="twofactor"
            type="checkbox"
            className="h-5 w-5 accent-primary"
            checked={enableTwoFactor}
            onChange={(event) => setEnableTwoFactor(event.target.checked)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : submitLabel}
        </Button>
      </form>

      <Dialog open={step === 2} onOpenChange={(open) => !open && setStep(1)}>
        <DialogContent>
          <AuthenticatorSetup onComplete={handleSetupComplete} userDetails={userDetails} />
          <div className="mt-4 flex justify-center">
            <Button variant="ghost" onClick={handleSkipSetup} disabled={isPending}>
              Skip authenticator for now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
