import { prisma } from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';

const PASSWORD_ROUNDS = 12;

export async function createUser(params: {
    email: string;
    name: string;
    password: string;
    role?: 'ADMIN' | 'MANAGER' | 'MEMBER';
    twoFactorSecret?: string | null;
    requiresTwoFactor?: boolean;
}) {
    const passwordHash = await hash(params.password, PASSWORD_ROUNDS);
    return prisma.user.create({
        data: {
            email: params.email,
            name: params.name,
            passwordHash,
            role: params.role ?? 'MEMBER',
            twoFactorSecret: params.twoFactorSecret ?? null,
            requiresTwoFactor: params.requiresTwoFactor ?? false,
        },
    });
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}

export async function authenticateWithPassword(email: string, password: string) {
    const user = await findUserByEmail(email);
    if (!user) return null;
    const isValid = await compare(password, user.passwordHash);
    if (!isValid) return null;
    return user;
}

export async function listUsers() {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function updateUserRole(userId: string, role: 'ADMIN' | 'MANAGER' | 'MEMBER') {
    return prisma.user.update({
        where: { id: userId },
        data: { role },
    });
}

export async function setTwoFactorSecret(userId: string, secret: string | null) {
    return prisma.user.update({
        where: { id: userId },
        data: { twoFactorSecret: secret },
    });
}

export async function setTwoFactorRequirement(userId: string, requiresTwoFactor: boolean) {
    return prisma.user.update({
        where: { id: userId },
        data: { requiresTwoFactor },
    });
}

export async function updateUserPassword(userId: string, password: string) {
    const passwordHash = await hash(password, PASSWORD_ROUNDS);
    return prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
    });
}
