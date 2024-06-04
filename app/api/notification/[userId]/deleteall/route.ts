import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		const { userId } = params;
		const loggedInUser = await getCurrentUser();
		if (!loggedInUser) {
			return new NextResponse('Profile not found', { status: 404 });
		}

		if (!loggedInUser || loggedInUser.id != userId) {
			return new NextResponse('Profile not found', { status: 404 });
		}
		await db.notification.deleteMany({
			where: {
				userId: loggedInUser.id,
			},
		});

		return new NextResponse(JSON.stringify('Notifications deleted'), { status: 200 });
	} catch (error) {
		console.error('[SERVER DELETE NOTIFICATIONS ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
