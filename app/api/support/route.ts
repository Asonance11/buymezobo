//import { getCurrentUser } from "@/lib/authentication";
import { db } from '@/lib/database';
import { calculateBuymeZoboRevenue, incrementProfileSupportBalance } from '@/lib/monetization';
import { triggerNotification } from '@/lib/notification';
import { PaymentStatus, Support } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const support: Optional<Support> = await request.json();

		if (!support) {
			return new NextResponse('Bad request', { status: 401 });
		}

		console.table(support);

		//TODO: this is where we can take 5 percent of the money and increment their money from here
		const [userMoney, revenue] = calculateBuymeZoboRevenue(support.amount!);

		const profile = await db.profile.findFirst({
			where: {
				id: support.profileId,
			},
		});

		if (!profile) {
			return new NextResponse('Bad request', { status: 401 });
		}

		const response = await db.support.create({
			data: {
				profileId: support?.profileId!,
				name: support.name ? support.name : 'Someone',
				anonymous: support.anonymous,
				content: support.content ? support.content : '',
				amount: userMoney,
				numberOfZobo: support.numberOfZobo!,
				paymentStatus: PaymentStatus.COMPLETED,
				paymentRef: support.paymentRef,
			},
		});

		// Increase the user's balance with userMoney
		await incrementProfileSupportBalance(profile.id, userMoney);

		console.log('Buy me zobo has increased revenue of ' + revenue);

		triggerNotification({
			type: 'BoughtZobo',
			userId: response.profileId,
			resourceId: response.id,
			content: response.content,
			senderId: null,
		});

		return new NextResponse(JSON.stringify(response), { status: 200 });
	} catch (error) {
		console.error('[SERVER CREATE SUPPORT ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
