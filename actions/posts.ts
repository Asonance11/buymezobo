'use server';
import { db } from '@/lib/database';
import { Post } from '@prisma/client';

export async function getCreatorPosts(creatorId: string, take?: number): Promise<Post[]> {
    try {
        let posts;

        if (take == 0) {
            posts = await db.post.findMany({
                where: {
                    profileId: creatorId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return posts;
        }

        posts = await db.post.findMany({
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
