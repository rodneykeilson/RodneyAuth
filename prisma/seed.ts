import { PrismaClient } from '../src/generated/prisma';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();
const PASSWORD_ROUNDS = 12;

async function main() {
  const defaultPassword = process.env.SEED_DEFAULT_PASSWORD ?? 'ChangeMe123!';
  const passwordHash = await hash(defaultPassword, PASSWORD_ROUNDS);

  const users = [
    {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@rodneyauth.local',
      name: process.env.SEED_ADMIN_NAME ?? 'Rodney Admin',
      role: 'ADMIN' as const,
      requiresTwoFactor: true,
    },
    {
      email: process.env.SEED_MANAGER_EMAIL ?? 'manager@rodneyauth.local',
      name: process.env.SEED_MANAGER_NAME ?? 'Security Manager',
      role: 'MANAGER' as const,
      requiresTwoFactor: false,
    },
    {
      email: process.env.SEED_MEMBER_EMAIL ?? 'member@rodneyauth.local',
      name: process.env.SEED_MEMBER_NAME ?? 'Team Member',
      role: 'MEMBER' as const,
      requiresTwoFactor: false,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        passwordHash,
        role: user.role,
        requiresTwoFactor: user.requiresTwoFactor,
      },
    });
  }

  console.log('Seeded default users with password:', defaultPassword);
  console.log('Update or remove SEED_* variables after initial setup for security.');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
