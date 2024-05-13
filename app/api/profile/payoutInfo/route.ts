import { getCurrentUser } from '@/lib/authentication';
import { db } from '@/lib/database';
import { createTransferRecipient } from '@/lib/paystack';
import { Profile } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const data: Optional<Profile> = await req.json();
	console.table(data);
	try {
		const profile = await getCurrentUser();

		if (!profile) {
			return new NextResponse('User is not authenticated', { status: 401 });
		}

		//INFO: create and save a transfer recipient https://paystack.com/docs/transfers/creating-transfer-recipients/#create-recipient

		let paystackResponse;

		if (data.bankCode && data.accountNumber && data.bankAccountName) {
			paystackResponse = await createTransferRecipient({ data });

			if (data.bankAccountName !== paystackResponse.data.details.account_name) {
				return new NextResponse('Unauthorized', { status: 400 });
			}
		}

		const updated = await db.profile.update({
			where: {
				id: profile.id,
			},
			data: {
				accountNumber: data.accountNumber || null,
				bankCode: data.bankCode || null,
				bankAccountName: data.bankAccountName || null,
				transferRecipientCode: paystackResponse?.data.recipient_code || null,
			},
		});

		console.table(updated);

		return new NextResponse('Bank details saved successfully', { status: 200 });
	} catch (err) {
		console.log('SERVER ERROR, PAYMENT INFO SIGNUP', { status: 500, err });
		return new NextResponse('Server error occurred', { status: 500 });
	}
}
