import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
    try {
        console.log("THIS REQUEST WAS HITTED IN THE PROCESS")
        const articles = await db.article.findMany({
            where: {
                type: 'PUBLISHED',
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
        });
        return NextResponse.json({ articles, username: params.username, message: 'ok' });
    } catch (error) {
        return NextResponse.json({ error, message: 'ok' });
    }
}
