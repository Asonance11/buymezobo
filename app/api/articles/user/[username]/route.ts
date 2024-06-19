import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
    try {
        const urlParams = new URL(request.url).searchParams;
        const page = parseInt(urlParams.get('page') || '1', 10);
        const limit = parseInt(urlParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;
        const showDraft = urlParams.get('draft') === 'true';

        const articles = await db.article.findMany({
            where: {
                type: showDraft ? 'DRAFT' : 'PUBLISHED',
                profile: {
                    userName: params.username,
                },
            },
            include: {
                profile: true,
                comments: {
                    include: {
                        profile: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: skip,
        });

        return NextResponse.json({ articles, message: 'ok' });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ error, message: 'Internal Server Error' }, { status: 500 });
    }
}

