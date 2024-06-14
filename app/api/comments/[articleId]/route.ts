import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { articleId: string } }) {
	try {
		const { articleId } = params;

		const comments = await db.comment.findMany({
			where: {
				articleId: articleId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				profile: true,
			},
		});

		return NextResponse.json({comments, status: 200 });
	} catch (error) {
		console.error('[SERVER GET NOTIFICATIONS ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
