
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, Loader2, Mail } from 'lucide-react';
import { login } from '@/app/actions';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginPanel() {
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isPending) return;

        setIsPending(true);
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const code = formData.get('code') as string;

        try {
            await login('authenticator', email, code);
        } catch (error: any) {
            if (error.digest?.startsWith('NEXT_REDIRECT')) {
                return;
            }

            toast({
                variant: 'destructive',
                title: 'Sign In Failed',
                description: error.message || 'An unexpected error occurred.',
            });
            setIsPending(false);
        }
    }

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="Email" required className="pl-10"/>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="code" className="sr-only">6-Digit Code</Label>
                <Input id="code" name="code" type="text" inputMode="numeric" maxLength={6} required placeholder="123456" className="text-center text-lg tracking-widest" />
            </div>
            <Button type="submit" className="w-full h-12" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : <><QrCode className="mr-2 h-5 w-5"/> Sign In with Authenticator</>}
            </Button>
        </form>
    )
}
