'use server';
import { db } from '@/lib/database';
import { Post } from '@prisma/client';

export async function getCreatorPosts(creatorId: string, take?: number): Promise<Post[]> {
	try {
		const posts = await db.post.findMany({
			where: {
				profileId: creatorId,
			},
			take: take ? take : 10,
			orderBy: {
				createdAt: 'desc',
			},
		});

		return posts;
	} catch (error) {
		console.log(error);
		return [];
	}
}
