import { CONFIG } from '@/utility/config';
import { Profile } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import axios from 'axios';
import { User } from 'lucia';

export interface createTransferRecipientInterface {
	data: Optional<User>;
	type?: TransferRecipientType;
}

export async function createTransferRecipient({
	data,
	type,
}: createTransferRecipientInterface): Promise<CreateTransferRecipientApiResponse> {
	try {
		const response = await axios.post(
			'https://api.paystack.co/transferrecipient',
			{
				type: type ? type : 'nuban',
				name: data.bankAccountName, //WARN: username and bank account name are different
				account_number: data.accountNumber,
				bank_code: data.bankCode,
				currency: 'NGN',
			},
			{
				headers: {
					Authorization: `Bearer ${CONFIG.paystack_key}`, // Replace SECRET_KEY with your Paystack secret key
					'Content-Type': 'application/json',
				},
			},
		);

		return response.data as CreateTransferRecipientApiResponse;
	} catch (error) {
		throw new Error('Failed to create transfer recipient: ' + error);
	}
}

export type TransferRecipientType = 'nuban' | 'ghipss' | 'mobile_money' | 'basa';

export const PAYMENT_CURRENCY = 'NGN';

export interface CreateTransferRecipientApiResponse {
	status: boolean;
	message: string;
	data: {
		active: boolean;
		createdAt: string;
		currency: string;
		domain: string;
		id: number;
		integration: number;
		name: string;
		recipient_code: string; //INFO: this is literally what we need
		type: string;
		updatedAt: string;
		is_deleted: boolean;
		details: {
			authorization_code: string | null;
			account_number: string;
			account_name: string;
			bank_code: string;
			bank_name: string;
		};
	};
}
