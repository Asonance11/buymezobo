import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { articleId: string } }) {
	try {
		const data = await request.json();

		const article = await db.article.findFirst({
			where: {
				id: params.articleId,
			},
		});

		if (!article) {
			throw new Error('Article not found');
		}

		const updatedArticle = await db.article.update({
			where: {
				id: params.articleId,
			},
			data: data,
		});

		return NextResponse.json({ article: updatedArticle, message: 'ok' });
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
