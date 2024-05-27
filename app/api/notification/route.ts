import { getCurrentUser } from '@/lib/authentication';
import { createNotification } from '@/lib/notification';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        const notif = await createNotification({
            type: 'Welcome',
            userId: user?.id,
            resourceId: '',
            senderId: 'user.id',
        });

        return new NextResponse(JSON.stringify(notif), { status: 200 });
    } catch (error) {
        console.error('[SERVER CREATE SUPPORT ERROR]', error);
        return new NextResponse('Internal Server Error', {
            status: 500,
        });
    }
}
