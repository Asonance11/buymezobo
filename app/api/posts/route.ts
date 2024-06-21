import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { Post, Profile } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import { User } from 'lucia';
import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
// 	try {
// 		const urlParams = new URL(request.url).searchParams;
// 		const page = parseInt(urlParams.get('page') || '1', 10);
// 		const limit = parseInt(urlParams.get('limit') || '10', 10);
// 		const skip = (page - 1) * limit;
//
// 		const posts = await db.post.findMany({
// 			where: {
// 				profile: {
// 					userName: params.username,
// 				},
// 			},
// 			include: {
// 				profile: true,
// 			},
// 			orderBy: {
// 				createdAt: 'desc',
// 			},
// 			take: limit,
// 			skip: skip,
// 		});
//
// 		return NextResponse.json({ posts, message: 'ok' });
// 	} catch (error) {
// 		console.error('Error fetching posts:', error);
// 		return NextResponse.json({ error, message: 'Internal Server Error' }, { status: 500 });
// 	}
// }

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
