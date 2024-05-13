//import { getCurrentUser } from "@/lib/authentication";
import { db } from '@/lib/database';
import { decrementProfileSupportBalance, transferMoneyPayoutFunction } from '@/lib/monetization';
import { PaymentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		console.clear();
		const profileData = await request.json();

		if (!profileData.amount || !profileData.id) {
			return new NextResponse('Bad request', { status: 401 });
		}

		console.table(profileData);

		const profile = await db.profile.findFirst({
			where: {
				id: profileData.id,
			},
		});

		if (!profile) {
			return new NextResponse('Bad request', { status: 401 });
		}

		if (profileData.amount > profile.balance) {
			return new NextResponse('Insufficient balance', { status: 401 });
		}

		if (!profile.transferRecipientCode) {
			return new NextResponse('Bad request: transfer recipient code not set', { status: 401 });
		}

		const transferResponse = await transferMoneyPayoutFunction(profileData.amount, profile.transferRecipientCode);

		if (!transferResponse) {
			return new NextResponse('Server Error with transferring money', { status: 401 });
		}

		console.table(transferResponse);
		//finalize transfer should be here

		const payout = await db.payout.create({
			data: {
				amount: profileData.amount,
				status: PaymentStatus.COMPLETED,
				profileId: profile.id,
				paystackTransferId: transferResponse.data.transfer_code,
				transferRecipientCode: profile.transferRecipientCode,
			},
		});

		// Increase the user's balance with userMoney
		await decrementProfileSupportBalance(profile.id, profileData.amount);

		return new NextResponse(JSON.stringify({ payout }), { status: 200 });
	} catch (error) {
		console.error('[SERVER CREATE TRANSFER SUPPORT ERROR]', error);
		return new NextResponse('Internal Server Error', {
			status: 500,
		});
	}
}
