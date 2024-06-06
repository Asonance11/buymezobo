import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { SocialMediaType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const profile = await getCurrentUser();

		if (!profile) {
			return new NextResponse('User is not authenticated', { status: 401 });
		}

		const socialMediaLinks = await db.socialMediaLink.findMany({
			where: { userId: profile.id },
		});

		return NextResponse.json({ socialMediaLinks, status: 200 });
	} catch (err) {
		console.log('SERVER ERROR, FETCHING SOCIAL MEDIA LINKS', { status: 500, err });
		return new NextResponse('Server error occurred', { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	const data = await req.json();
	try {
		const profile = await getCurrentUser();

		if (!profile) {
			return new NextResponse('User is not authenticated', { status: 401 });
		}

		// Delete existing links associated with the user ID
		await db.socialMediaLink.deleteMany({
			where: {
				userId: profile.id,
			},
		});

		// Insert the new links
		const updatedLinks = await Promise.all(
			data.links.map(async (link: { type: string; url: string }) => {
				return db.socialMediaLink.create({
					data: {
						type: link.type as SocialMediaType,
						url: link.url,
						userId: profile.id,
					},
				});
			}),
		);

		return NextResponse.json({
			message: 'Social media links updated successfully',
			links: updatedLinks,
			status: 200,
		});
	} catch (err) {
		console.log('SERVER ERROR, SOCIAL MEDIA LINKS', { status: 500, err });
		return new NextResponse('Server error occurred', { status: 500 });
	}
}
