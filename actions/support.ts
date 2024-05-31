'use server';
import { db } from '@/lib/database';
import { Support } from '@prisma/client';

export async function getSupportbyId(id: string, includeComments: boolean = false): Promise<Support | null> {
    try {
        const support = await db.support.findFirst({
            where: {
                id,
            },
            include: {
                comments: includeComments,
            },
        });
        return support;
    } catch (error) {
        return null;
    }
}
export async function getCreatorSupports(creatorId: string, take?: number, deleted: boolean = false) {
    try {
        const supports = await db.support.findMany({
            where: {
                profileId: creatorId,
                deleted: deleted,
            },
            take: take ? take : 10,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                comments: true,
            },
        });

        const count = await db.support.count();

        return [supports, count, null];
    } catch (error) {
        console.log(error);
        return [[], 0, error as Error];
    }
}
