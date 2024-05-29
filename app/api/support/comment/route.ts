import { getCreatorPosts } from '@/actions/posts';
import { getCreatorSupports } from '@/actions/support';
import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { commentText, userId, supportId } = await request.json();

        const user = await getCurrentUser();

        console.log(user);

        if (!supportId || !user || user.id !== userId || !commentText) {
            return new NextResponse('Bad request', { status: 401 });
        }

        await db.comment.create({
            data: {
                supportId: supportId,
                content: commentText,
            },
        });

        const support = await getCreatorSupports(user.id, 5);

        return new NextResponse(JSON.stringify(support), { status: 200 });
    } catch (error) {
        console.error('[SERVER CREATE SUPPORT ERROR]', error);
        return new NextResponse('Internal Server Error', {
            status: 500,
        });
    }
}

