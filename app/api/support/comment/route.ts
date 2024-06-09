import { getCreatorSupports } from '@/actions/support';
import { getCurrentUser } from '@/lib/authentication';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const { commentText, profileId: userId, supportId } = await request.json();
		const user = await getCurrentUser();
		if (!supportId || !user || user.id !== userId || !commentText) {
			return new NextResponse('Bad request', { status: 401 });
		}
		const support = await getCreatorSupports(user.id);
		return new NextResponse(JSON.stringify(support), { status: 200 });
	} catch (error) {
		console.error('[SERVER CREATE SUPPORT ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
