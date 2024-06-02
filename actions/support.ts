'use server';
import { db } from '@/lib/database';
import { PaginatedResponse } from '@/types/paginated-response.interface';
import { Support } from '@prisma/client';

const LIMIT = 10;

export async function getSupportbyId(id: string): Promise<Support | null> {
	try {
		const support = await db.support.findFirst({
			where: {
				id,
			},
		});
		return support;
	} catch (error) {
		return null;
	}
}

/**
 *
 * @param creatorId Id of the user whose info you need to get
 * @param page `default = 1`. Page number you want to get.
 * @param deleted `default = false`. Specify if you want to include deleted information in the returned data
 * @returns
 */

export async function getCreatorSupports(
	creatorId: string,
	page: number = 1,
	deleted: boolean = false,
): Promise<PaginatedResponse<Support>> {
	const offset = (page - 1) * LIMIT;
	const supports = await db.support.findMany({
		where: {
			profileId: creatorId,
			deleted: deleted,
		},
		take: LIMIT,
		skip: offset,
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			supporter: true,
			comments: {
				include: {
					profile: true,
				},
			},
		},
	});

	const count = await db.support.count();

	return { data: supports, meta: { page, pageSize: LIMIT, totalCount: count, dataCount: supports.length } };
}
