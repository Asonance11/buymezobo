import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { userId: string; notificationId: string } }) {
	try {
		const { userId, notificationId } = params;
		const loggedInUser = await getCurrentUser();
		if (!loggedInUser || loggedInUser.id != userId) {
			return new NextResponse('Profile not found', { status: 404 });
		}
		await db.notification.delete({
			where: {
				id: notificationId,
				userId: loggedInUser.id,
			},
		});

		return new NextResponse(JSON.stringify('Notification deleted'), { status: 200 });
	} catch (error) {
		console.error('[SERVER DELETE SINGLE NOTIFICATION ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
