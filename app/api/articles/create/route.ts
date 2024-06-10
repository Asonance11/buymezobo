import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const option = await request.json();

        const user = await getCurrentUser();

		const article = await db.article.create({
			data: {
                profileId: user?.id,
				type: option.type,
				title: option.title,
				content: option.content,
				image: option.headerImage,
			},
		});

		return NextResponse.json({ article, success: true });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
