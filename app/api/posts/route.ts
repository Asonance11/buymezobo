import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { Post, Profile } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import { User } from 'lucia';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const postData: Optional<Post> = await req.json();
		const { caption, imageUrl, title } = postData;

		if (!caption || !imageUrl || !title) {
			return new NextResponse('Bad request', { status: 401 });
		}

		console.table(postData);

		const profile = await getCurrentUser();

		if (!profile) {
			return new NextResponse('Profile not found', { status: 404 });
		}

		const post = await db.post.create({
			data: {
				caption,
				imageUrl,
				title,
				profile: {
					connect: {
						id: profile.id,
					},
				},
			},
		});

		return NextResponse.json({ status: 201, profile: post });
	} catch (error) {
		console.error('[SERVER UPDATE PROFILE ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
