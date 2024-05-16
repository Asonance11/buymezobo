'use server';

import { verify } from '@node-rs/argon2';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ActionResult } from 'next/dist/server/app-render/types';
import * as z from 'zod';
import { db } from '@/lib/database';

const SignInSchema = z.object({
	email: z.string().email().min(1, { message: 'This field is required' }).trim(),
	password: z
		.string()
		.min(6, { message: 'Password must be a minimum of 6 characters' })
		.max(12, { message: 'Password must not exceed 12 characters' })
		.trim(),
});

type SignInData = z.infer<typeof SignInSchema>;

async function login(formData: SignInData): Promise<ActionResult> {
	'use server';
	SignInSchema.parse(formData);

	const email = formData.email.toLowerCase();
	const password = formData.password;

	const existingUser = await db.profile.findUnique({ where: { email } });

	if (!existingUser) {
		// NOTE:
		// Returning immediately allows malicious actors to figure out valid usernames from response times,
		// allowing them to only focus on guessing passwords in brute-force attacks.
		// As a preventive measure, you may want to hash passwords even for invalid usernames.
		// However, valid usernames can be already be revealed with the signup page among other methods.
		// It will also be much more resource intensive.
		// Since protecting against this is non-trivial,
		// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
		// If usernames are public, you may outright tell the user that the username is invalid.
		return {
			error: 'Incorrect username or password',
		};
	}

	const validPassword = await verify(existingUser.passwordHash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
	if (!validPassword) {
		return {
			error: 'Incorrect username or password',
		};
	}

	const session = await lucia.createSession(existingUser.userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect('/');
}

export { login };
