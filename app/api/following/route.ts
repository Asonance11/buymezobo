import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const data = await req.json();
    console.table(data);
    try {
        const profile = await getCurrentUser();

        if (!profile) {
            return new NextResponse('User is not authenticated', { status: 401 });
        }

        // Check if the follow relationship already exists
        const existingFollow = await db.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: profile.id,
                    followingId: data.followingId,
                },
            },
        });

        if (existingFollow) {
            return new NextResponse('Already following this user', { status: 409 });
        }

        const follow = await db.follows.create({
            data: {
                followerId: profile.id,
                followingId: data.followingId,
            },
        });

        return NextResponse.json({ message: 'Successfully followed', user: follow, status: 200 });
    } catch (err) {
        console.log('SERVER ERROR, FOLLOW ACTION', { status: 500, err });
        return new NextResponse('Server error occurred', { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const data = await req.json();
    console.table(data);
    try {
        const profile = await getCurrentUser();

        if (!profile) {
            return new NextResponse('User is not authenticated', { status: 401 });
        }

        const follow = await db.follows.deleteMany({
            where: {
                followerId: profile.id,
                followingId: data.followingId,
            },
        });

        if (follow.count === 0) {
            return new NextResponse('Follow relationship not found', { status: 404 });
        }

        return NextResponse.json({ message: 'Successfully unfollowed', user: follow, status: 200 });
    } catch (err) {
        console.log('SERVER ERROR, UNFOLLOW ACTION', { status: 500, err });
        return new NextResponse('Server error occurred', { status: 500 });
    }
}
