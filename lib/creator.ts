'use server';

import { Profile } from '@prisma/client';
import { db } from './database';
import { User } from 'lucia';

export async function getCreatorByName(name: string): Promise<User | null> {
	try {
		const creator = await db.profile.findFirst({
			where: {
				userName: name,
			},
		});

		return creator as User;
	} catch (error) {
		return null;
	}
}
