
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, Mail } from 'lucide-react';
import { loginWithPassword } from '@/app/actions';
import { Input } from '@/components/ui/input';
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
        const password = formData.get('password') as string;

        try {
            await loginWithPassword(email, password);
        } catch (error) {
            const digest =
                typeof error === 'object' && error !== null && 'digest' in error
                    ? String((error as { digest?: unknown }).digest ?? '')
                    : '';
            if (digest.startsWith('NEXT_REDIRECT')) {
                return;
            }

            const message =
                error instanceof Error && error.message
                    ? error.message
                    : 'An unexpected error occurred.';

            toast({
                variant: 'destructive',
                title: 'Sign In Failed',
                description: message,
            });
            setIsPending(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email" name="email" type="email" placeholder="Email" required className="pl-10" />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="password" name="password" type="password" placeholder="Password" required className="pl-10" />
                </div>
                <Button type="submit" className="w-full h-12" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : 'Sign In'}
                </Button>
            </form>
            <div className="text-sm text-muted-foreground text-center">
                Prefer codes?{' '}
                <Link href="/authenticator" className="font-medium text-primary hover:underline">
                    Use authenticator login
                </Link>
            </div>
        </div>
    );
}
