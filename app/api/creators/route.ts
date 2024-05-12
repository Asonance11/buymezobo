import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const creator = url.searchParams.get('creator');

	let creators;

	if (!creator) {
		creators = await db.profile.findMany({
			take: 10,
		});
		return NextResponse.json({ creators });
	}

	creators = await db.profile.findMany({
		where: {
			userName: {
				contains: creator,
			},
		},
		take: 10,
	});

	return NextResponse.json({ creators });
}
