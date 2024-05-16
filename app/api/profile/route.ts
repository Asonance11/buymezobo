import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { Profile } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import { User } from 'lucia';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
	try {
		const updatedProfile: Optional<User> = await req.json();
		console.table(updatedProfile);

		const profile = await getCurrentUser();

		if (!profile) {
			return new NextResponse('Profile not found', { status: 404 });
		}

		if (updatedProfile.id !== profile.id) {
			return new NextResponse('Unauthorised', { status: 404 });
		}

		const newProfile = await db.profile.update({
			where: {
				id: profile.id,
			},
			data: updatedProfile,
		});

		return NextResponse.json({ status: 201, profile: newProfile });
	} catch (error) {
		console.error('[SERVER UPDATE PROFILE ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
