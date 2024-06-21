import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { Post, Profile } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import { User } from 'lucia';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
	try {
		const urlParams = new URL(request.url).searchParams;
		const page = parseInt(urlParams.get('page') || '1', 10);
		const limit = parseInt(urlParams.get('limit') || '10', 10);
		const skip = (page - 1) * limit;

		const posts = await db.post.findMany({
			where: {
				profile: {
					userName: params.username,
				},
			},
			include: {
				profile: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
			skip: skip,
		});

		return NextResponse.json({ posts, message: 'ok' });
	} catch (error) {
		console.error('Error fetching posts:', error);
		return NextResponse.json({ error, message: 'Internal Server Error' }, { status: 500 });
	}
}

