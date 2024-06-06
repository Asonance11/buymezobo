import { getCreatorSupports } from '@/actions/support';
import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
	request: NextRequest,

	{ params }: { params: { supportId: string } },
) {
	try {
		const { supportId } = params;
		const loggedInUser = await getCurrentUser();
		if (!loggedInUser) {
			return new NextResponse('Profile not found', { status: 404 });
		}
		const support = await db.support.update({
			where: {
				id: supportId,
				profileId: loggedInUser.id,
			},
			data: {
				deleted: true,
			},
		});
		console.log(support);

		const supports = await getCreatorSupports(loggedInUser.id, 5);
		return new NextResponse(JSON.stringify(supports), { status: 200 });
	} catch (error) {
		console.error('[SERVER DELETE SUPPORT ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
