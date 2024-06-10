import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const user = await getCurrentUser();
		const articles = await db.article.findMany({
			where: {
				profileId: user?.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
		return NextResponse.json({ articles, message: 'ok' });
	} catch (error) {

		return NextResponse.json({ error, message: 'ok', });
    }
}
