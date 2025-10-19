'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ShieldCheck } from 'lucide-react';
import { logout } from '@/app/actions';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { SessionUser } from '@/lib/session';

type HeaderProps = {
  session: SessionUser;
};

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users', role: 'ADMIN' as const },
  { href: '/authenticator', label: 'Authenticator Login' },
];

export default function Header({ session }: HeaderProps) {
  const pathname = usePathname();
  const initials = session.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg">RodneyAuth</span>
          <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            {NAV_LINKS.filter((link) => !link.role || link.role === session.role).map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive ? 'text-primary font-medium' : 'transition-colors hover:text-primary'
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className={`h-4 w-4 ${session.twoFactorEnabled ? 'text-primary' : 'text-muted-foreground/70'}`} />
            {session.twoFactorEnabled ? 'Authenticator enabled' : 'Authenticator pending'}
          </span>
          <Avatar>
            <AvatarImage src={`https://picsum.photos/seed/${session.email}/40/40`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm text-foreground max-w-[140px] truncate">
            {session.name}
          </span>
          <form action={logout}>
            <Button variant="outline" size="icon" type="submit" aria-label="Log out">
              <LogOut className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
