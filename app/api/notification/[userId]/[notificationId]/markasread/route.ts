import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { userId: string; notificationId: string } }) {
	try {
		const { userId, notificationId } = params;
		const loggedInUser = await getCurrentUser();
		if (!loggedInUser || loggedInUser.id != userId) {
			return new NextResponse('Profile not found', { status: 404 });
		}
		await db.notification.update({
			where: {
				id: notificationId,
				userId: loggedInUser.id,
			},
			data: {
				isRead: true,
			},
		});

		return new NextResponse(JSON.stringify('Notification updated'), { status: 200 });
	} catch (error) {
		console.error('[SERVER UPDATE SINGLE NOTIFICATION ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
