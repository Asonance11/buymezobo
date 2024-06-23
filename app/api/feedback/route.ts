import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const data = await request.json();

		await db.feedback.create({
			data: {
                name:data.name,
                email:data.email,
                content:data.content,
                userId:data.userId
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ error });
	}
}
