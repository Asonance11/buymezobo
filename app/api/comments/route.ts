import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const data = await request.json();

		const user = await getCurrentUser();

        if(user?.id !== data.author.id){
            return new NextResponse('Bad request', { status: 401 });
        }

        const comment = await db.comment.create({
            data: {
                profileId: user?.id,
                articleId: data.parentId,
                content: data.content,
            },
        })

		return NextResponse.json({ comment , success: true });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
