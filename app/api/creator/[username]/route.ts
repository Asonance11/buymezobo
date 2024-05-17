import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const username = url.searchParams.get('username');
	if (username) {
		const creator = await db.profile.findUnique({
			where: {
				userName: username,
			},
		});
		return NextResponse.json({ creator, success: true });
	}
	return NextResponse.json({ success: false }, { status: 404 });
}
