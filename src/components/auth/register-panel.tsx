"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { generateAuthenticatorSecret, verifyAuthenticatorCode } from '@/app/auth/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function AuthenticatorSetup({ onComplete, userDetails }: { onComplete: () => void, userDetails: {email: string, name: string} }) {
  const [setupData, setSetupData] = useState<{ secret: string; qrCode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleGenerateSecret = async () => {
    setIsPending(true);
    try {
  const data = await generateAuthenticatorSecret(userDetails.email);
      setSetupData(data);
    } catch (err) {
      console.error(err);
      setError("Could not generate authenticator secret. Please try again.");
    } finally {
        setIsPending(false);
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData) return;
    setIsPending(true);
    setError(null);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const code = formData.get('code') as string;

    try {
        const isValid = await verifyAuthenticatorCode({ code, secret: setupData.secret, name: userDetails.name, email: userDetails.email });
        if (isValid) {
            onComplete();
        } else {
            setError("The code is incorrect. Please check your authenticator app and try again.");
            setIsPending(false);
        }
  } catch (err) {
    const message = err instanceof Error && err.message
      ? err.message
      : "An unexpected error occurred during verification.";
    setError(message);
        setIsPending(false);
    }
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (!setupData) {
      return (
          <DialogHeader>
                <DialogTitle className="text-center">Set up Authenticator App</DialogTitle>
                <DialogDescription className="text-center space-y-4">
                    Click the button below to generate your unique QR code.
                </DialogDescription>
                <div className='pt-4'>
                    <Button className="w-full" onClick={handleGenerateSecret} disabled={isPending}>
                        {isPending ? <Loader2 className="animate-spin" /> : "Generate QR Code"}
                    </Button>
                </div>
          </DialogHeader>
      )
  }

  return (
    <DialogHeader>
      <DialogTitle className="text-center">Set up Authenticator App</DialogTitle>
      <DialogDescription className="text-center space-y-4">
        <p>Scan this QR code with your authenticator app (e.g., Google Authenticator).</p>
        <div className="flex justify-center p-4 bg-white rounded-lg">
            <Image src={setupData.qrCode} alt="QR Code" width={200} height={200}/>
        </div>
        <p>Then, enter the 6-digit code below.</p>
        </DialogDescription>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <Input name="code" placeholder="123456" required className="text-center text-lg tracking-widest" />
        <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin"/> : "Verify & Finish"}
        </Button>
      </form>
    </DialogHeader>
  );
}

export default function RegisterPanel({ onRegisterSuccess }: { onRegisterSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [userDetails, setUserDetails] = useState({ email: '', name: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    setUserDetails({ email, name });
    setStep(2);
  };
  
  const handleSetupComplete = () => {
      toast({
          title: "Registration Successful",
          description: "You can now sign in with your authenticator app.",
          className: "border-primary"
      });
      setStep(1);
      onRegisterSuccess();
  }

  return (
    <>
      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-4">
           <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="email" name="email" type="email" placeholder="Email" required className="pl-10"/>
           </div>
           <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="name" name="name" type="text" placeholder="Full Name" required className="pl-10"/>
           </div>
        </div>
        
        <div className="text-sm text-muted-foreground pt-2">
            You will set up an authenticator app as your sign-in method.
        </div>
        
        <Button type="submit" className="w-full">Continue to Authenticator Setup</Button>
      </form>

      <Dialog open={step === 2} onOpenChange={(open) => !open && setStep(1)}>
        <DialogContent>
            <AuthenticatorSetup onComplete={handleSetupComplete} userDetails={userDetails} />
        </DialogContent>
      </Dialog>
    </>
  );
}
