import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@/components/header';
import { getSession } from '@/lib/session';
import { listUsers } from '@/lib/user-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateUserPasswordAction, updateUserRoleAction, toggleTwoFactorRequirementAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  MEMBER: 'Member',
};

export default async function AdminUsersPage() {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  if (session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await listUsers();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header session={session} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">User control</h1>
              <p className="text-muted-foreground">Manage roles and two-factor requirements across the team.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Directory</CardTitle>
              <CardDescription>Role assignments and security controls per user.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground uppercase tracking-wide text-xs">
                      <th className="py-3 pr-4">Name</th>
                      <th className="py-3 pr-4">Email</th>
                      <th className="py-3 pr-4">Role</th>
                      <th className="py-3 pr-4">Two-factor</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="py-3 pr-4 font-medium">{user.name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{user.email}</td>
                        <td className="py-3 pr-4">
                          <form action={updateUserRoleAction} className="flex items-center gap-2">
                            <input type="hidden" name="userId" value={user.id} />
                            <select
                              name="role"
                              defaultValue={user.role}
                              className="rounded-md border border-input bg-transparent px-2 py-1 text-sm"
                            >
                              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                            <Button type="submit" size="sm" variant="outline">
                              Save
                            </Button>
                          </form>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="font-medium">
                            {user.twoFactorSecret ? 'Enabled' : 'Disabled'}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {user.requiresTwoFactor ? 'Required' : 'Optional'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-col gap-2">
                            <form action={toggleTwoFactorRequirementAction} className="flex items-center gap-2">
                              <input type="hidden" name="userId" value={user.id} />
                              <input type="hidden" name="requires" value={(!user.requiresTwoFactor).toString()} />
                              <Button type="submit" size="sm" variant="ghost">
                                {user.requiresTwoFactor ? 'Allow optional' : 'Require 2FA'}
                              </Button>
                            </form>
                            <form action={updateUserPasswordAction} className="flex items-center gap-2">
                              <input type="hidden" name="userId" value={user.id} />
                              <Input
                                type="password"
                                name="password"
                                placeholder="New password"
                                minLength={8}
                                required
                                autoComplete="new-password"
                                className="h-9 max-w-[160px]"
                              />
                              <Button type="submit" size="sm" variant="outline">
                                Set password
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
