'use server';

import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { hash, verify } from '@node-rs/argon2';
import { Profile } from '@prisma/client';
import { User } from 'lucia';
import * as z from 'zod';
import { signOut } from './signout';
import { redirect } from 'next/navigation';

const newPasswordSchema = z.string().min(6, { message: 'Password must be a minimum of 6 characters' }).trim();

export async function updateProfile(data: Partial<User>): Promise<[Profile | null, Error | null]> {
	const user = await getCurrentUser();
	if (!user) throw new Error('Unauthorized');

	if (data.userName) {
		data.userName = data.userName.toLowerCase();
		const existingUser = await db.profile.findUnique({ where: { userName: data.userName } });
		if (existingUser) throw new Error(`The username '${data.userName}' is already taken`);
	}
	const profile = await db.profile.update({ where: { id: user.id }, data });
	return [profile, null];
}

export async function changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
	newPasswordSchema.parse(newPassword);

	const user = await db.profile.findUnique({ where: { id } });
	if (!user) throw new Error('User not found');

	// validate old password
	const validPassword = await verify(user.passwordHash ?? '', oldPassword, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	if (!validPassword) throw new Error('Incorrect password');

	const passwordHash = await hash(newPassword, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	await db.profile.update({ where: { id }, data: { passwordHash } });

	signOut();
}
