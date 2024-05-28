import { getCurrentUser } from '@/lib/authentication';
import { createNotification, triggerNotification } from '@/lib/notification';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();

		triggerNotification({
			type: 'Welcome',
			userId: user?.id,
			resourceId: '',
			senderId: 'user.id',
		});

		console.log('[1] Notification created');

		return new NextResponse(JSON.stringify('Done creating notification'), { status: 200 });
	} catch (error) {
		console.error('[SERVER CREATE SUPPORT ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
