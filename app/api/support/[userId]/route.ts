import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
	console.log('REQUESTEDDDDDDDDDDDD');
	try {
		const { userId } = params;
		const loggedInUser = await getCurrentUser();

		if (!loggedInUser || loggedInUser.id !== userId) {
			return new NextResponse('Profile not found', { status: 404 });
		}
		const urlParams = new URL(request.url).searchParams;
		const showDeleted = urlParams.get('deleted') === 'true';
		const page = parseInt(urlParams.get('page') || '1', 10);
		const limit = parseInt(urlParams.get('limit') || '10', 10);
		const skip = (page - 1) * limit;

		const whereClause: any = {
			profileId: loggedInUser.id,
		};

		if (!showDeleted) {
			whereClause.deleted = false; // Only show non-deleted supports by default
		}

		const supporters = await db.support.findMany({
			where: whereClause,
			include: {
				profile: true,
				comments: true,
				supporter: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
			skip: skip,
		});

		return NextResponse.json({ supporters, status: 200 });
	} catch (error) {
		console.error('[SERVER GET SUPPORTERS ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
