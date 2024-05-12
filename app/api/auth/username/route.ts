import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const username = url.searchParams.get('username')?.toLowerCase();

	if (username == 'siji') {
		return NextResponse.json({ available: false });
	}

	const available = await db.profile.findFirst({
		where: {
			userName: username,
		},
	});

	if (available == null) {
		return NextResponse.json({ available: true });
	}

	return NextResponse.json({ available: false });
}
