import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { articleId: string } }) {
	try {
		const article = await db.article.findFirst({
			where: {
				id: params.articleId,
			},
			include: {
				comments: {
					include: { profile: true },
				},
				profile: true,
			},
		});
		// You might want to return a response here
		return NextResponse.json({ article: article, message: 'ok' });
	} catch (error) {
		// Handle the error here, e.g., return an error response
		return new Response(JSON.stringify({ error: 'Something went wrong' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}
