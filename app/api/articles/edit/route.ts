import { db } from '@/lib/database';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const options = await request.json();
        console.table(options);

    } catch (error) { }
}
