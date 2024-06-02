'use server';

import { Profile, SocialMediaLink } from '@prisma/client';
import { db } from './database';

interface User extends Profile {
	socialMediaLink: SocialMediaLink[];
}

export async function getCreatorByName(name: string): Promise<User | null> {
	try {
		const creator = await db.profile.findFirst({
			where: {
				userName: name,
			},
			include: {
				socialMediaLink: true,
			},
		});

		return creator as User;
	} catch (error) {
		return null;
	}
}
