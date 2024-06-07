import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { postId: string } }) {
	try {
		const { postId } = params;
		const loggedInUser = await getCurrentUser();
		if (!loggedInUser) {
			return new NextResponse('Profile not found', { status: 404 });
		}

		const postFind = await db.post.findFirst({
			where: {
				id: postId,
				profileId: loggedInUser.id,
			},
		});

		if (!postFind) {
			return new NextResponse('Post not found', { status: 404 });
		}

		const newUrl = postFind.imageUrl.substring(postFind.imageUrl.lastIndexOf('/') + 1);

		const deleteImage = { success: true }; //TODO: delete the image

		if (!deleteImage.success) {
			return new NextResponse('Internal Server Error', {
				status: 500,
			});
		}

		const post = await db.post.delete({
			where: {
				id: postFind?.id,
			},
		});

		return new NextResponse(JSON.stringify(post), { status: 200 });
	} catch (error) {
		console.error('[SERVER DELETE IMAGE POST ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
