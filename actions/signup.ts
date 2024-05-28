'use server';

import { db } from '../lib/database';
import { hash } from '@node-rs/argon2';
import { cookies } from 'next/headers';
import { lucia } from '../lib/auth';
import { redirect } from 'next/navigation';
import { ActionResult } from 'next/dist/server/app-render/types';
import * as z from 'zod';
import { useUser as User } from '@/store/UserDataStore';
import { useAuth as Auth } from './use-auth';

interface SignUpData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

const SignUpSchema = z.object({
    email: z.string().email().min(1, { message: 'This field is required' }).trim(),
    password: z
        .string()
        .min(6, { message: 'Password must be a minimum of 6 characters' })
        .trim(),
    firstName: z.string().max(50),
    lastName: z.string().max(50),
});

async function signup(formData: SignUpData): Promise<ActionResult> {
    try {
        SignUpSchema.parse(formData);

        const email = formData.email.toLowerCase();
        const password = formData.password;

        console.log(email, password);

        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        });

        const userId = crypto.randomUUID(); // 16 characters long

        // Check if email is already used
        const thisProfile = await db.profile.findUnique({ where: { email: formData.email } });

        if (thisProfile) {
            return { success: false, error: 'This Email is already in use' };
        }

        await db.profile.create({
            data: {
                userId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email,
                passwordHash,
                imageUrl: '',
            },
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export { signup };
