'use server';
import { db } from '@/lib/database';
import { Support } from '@prisma/client';

export async function getCreatorSupports(creatorId: string, take?: number): Promise<[Support[], number, Error | null]> {
	try {
		const supports = await db.support.findMany({
			where: {
				profileId: creatorId,
			},
			take: take ? take : 10,
			orderBy: {
				createdAt: 'desc',
			},
		});

		const count = await db.support.count();

		return [supports, count, null];
	} catch (error) {
		console.log(error);
		return [[], 0, error as Error];
	}
}
