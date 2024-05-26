'use server';

import { db } from '../lib/database';
import { hash } from '@node-rs/argon2';
import { cookies } from 'next/headers';
import { lucia } from '../lib/auth';
import { redirect } from 'next/navigation';
import { ActionResult } from 'next/dist/server/app-render/types';
import * as z from 'zod';

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
		.max(12, { message: 'Password must not exceed 20 characters' })
		.trim(),
	firstName: z.string().max(50),
	lastName: z.string().max(50),
});

async function signup(formData: SignUpData): Promise<ActionResult> {
	SignUpSchema.parse(formData);

	const email = formData.email.toLowerCase();
	const password = formData.password;

	console.log(email, password);

	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	const userId = crypto.randomUUID(); // 16 characters long

	// TODO: check if email is already used
	const thisProfile = await db.profile.findUnique({ where: { email: formData.email } });

	if (thisProfile) throw new Error('This user already exists.');

	await db.profile.create({
		data: { userId, firstName: formData.firstName, lastName: formData.lastName, email, passwordHash, imageUrl: '' },
	});

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect('/aftersignup');
}

export { signup };
