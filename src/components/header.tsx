'use client';

import { logout } from '@/app/actions';
import { Button } from './ui/button';
import { Power } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function Header({ userName }: { userName: string }) {
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <span className="font-bold">RodneyAuth</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Avatar>
            <AvatarImage src={`https://picsum.photos/seed/${userName}/40/40`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm text-foreground">
            {userName}
          </span>
          <form action={logout}>
            <Button variant="outline" size="icon" type="submit" aria-label="Log out">
              <Power className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
