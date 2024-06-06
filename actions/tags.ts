'use server';
import { db } from '@/lib/database';

export async function getCreatorTags(creatorId: string): Promise<string[]> {
	try {
		const profile = await db.profile.findFirst({
			where: {
				id: creatorId,
			},
		});
		if (!profile) {
			throw new Error(`Could not find creator ${creatorId}`);
		}
		return profile?.tags;
	} catch (error) {
		console.log(error);
		return [];
	}
}
