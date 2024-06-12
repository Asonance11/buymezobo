import { getCurrentUser } from '@/lib/authentication';
import { triggerNotification } from '@/lib/notification';
import redis from '@/lib/redis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // const user = await getCurrentUser();
        // if (!user) {
        // 	return;
        // }
        // triggerNotification({
        // 	type: 'Welcome',
        // 	userId: user?.id,
        // 	resourceId: '',
        // 	senderId: 'user.id',
        // 	content: 'Welcome to buymezobo',
        // });
        // console.log('[1] Notification created');

        await redis.set('key', 'stuffffffffffffffffffffff');

        // Get the value
        const value = await redis.get('key');

        console.log('REDIS RETURNED' + value);

        return new NextResponse(JSON.stringify(value), { status: 200 });
    } catch (error) {
        console.error('[SERVER CREATE SUPPORT ERROR]', error);
        return new NextResponse('Internal Server Error', {
            status: 500,
        });
    }
}
