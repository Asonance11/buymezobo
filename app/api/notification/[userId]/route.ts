import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		const { userId } = params;
		const loggedInUser = await getCurrentUser();

		if (!loggedInUser || loggedInUser.id !== userId) {
			return new NextResponse('Profile not found', { status: 404 });
		}

		const urlParams = new URL(request.url).searchParams;
		const isReadParam = urlParams.get('isRead');
		const page = parseInt(urlParams.get('page') || '1', 10);
		const limit = parseInt(urlParams.get('limit') || '10', 10);
		const skip = (page - 1) * limit;

		let notifications;

		const whereClause: any = {
			userId: loggedInUser.id,
		};

		if (isReadParam !== null) {
			whereClause.isRead = isReadParam === 'true';
		}

		notifications = await db.notification.findMany({
			where: whereClause,
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
			skip: skip,
		});
        console.log(notifications)
		return new NextResponse(JSON.stringify(notifications), { status: 200 });
	} catch (error) {
		console.error('[SERVER GET NOTIFICATIONS ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
