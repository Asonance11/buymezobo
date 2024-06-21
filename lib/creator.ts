'use server';

import { Post, Profile, SocialMediaLink } from '@prisma/client';
import { db } from './database';
import { ProfilePrimitive } from '@/types/primitives';

interface User extends Profile {
	socialMediaLink: SocialMediaLink[];
	posts: Post[];
}

export async function getCreatorByName(name: string): Promise<ProfilePrimitive | null> {
	try {
		const creator = await db.profile.findFirst({
			where: {
				userName: name,
			},
			include: {
				socialMediaLink: true,
				posts: true,
				followers: true,
				following: true,
			},
		});

		return creator as any;
	} catch (error) {
		return null;
	}
}
