import { db } from '@/lib/database';
import { TransferResponse } from '@/types/trnasfer';
import { CONFIG } from '@/utility/config';
import { Profile } from '@prisma/client';
import axios from 'axios';

export const BUYMEZOBO_PLATFORM_PERCENTAGE = 6.5; // Constant for platform percentage

export async function transferMoneyPayoutFunction(
	amount: number,
	recipientId: string,
): Promise<TransferResponse | null> {
	try {
		const url = 'https://api.paystack.co/transfer';
		const authorization = `Authorization: Bearer ${CONFIG.paystack_key}`;
		const contentType = 'Content-Type: application/json';
		const data = {
			source: 'balance',
			reason: 'for all the wonderful content you have created for your supporters',
			amount: amount,
			recipient: recipientId,
		};

		const response = await axios.post(url, data, {
			headers: {
				Authorization: authorization,
				'Content-Type': contentType,
			},
		});

		if (!response.data) {
			throw new Error('Failed to transfer money as payout');
		}
		return response.data;
	} catch (error) {
		console.error('Error transferring money as payout:', error);
		return null;
	}
}

export function calculateBuymeZoboRevenue(amount: number): [number, number] {
	const revenue = (amount * BUYMEZOBO_PLATFORM_PERCENTAGE) / 100;
	const ProfileAmount = amount - revenue;
	return [ProfileAmount, revenue];
}

export async function incrementProfileSupportBalance(ProfileId: string, amount: number): Promise<void> {
	try {
		const Profile: Profile | null = await db.profile.findUnique({
			where: {
				id: ProfileId,
			},
		});

		// If Profile not found, throw an error
		if (!Profile) {
			throw new Error('Profile not found');
		}

		// Update the Profile's balance by adding the amount
		const updatedProfile = await db.profile.update({
			where: {
				id: ProfileId,
			},
			data: {
				balance: Profile.balance + amount,
			},
		});

		// Log the updated Profile's balance
		console.log(`Profile balance updated: ${updatedProfile.balance}`);
	} catch (error) {
		// Handle errors
		console.error('Error updating Profile balance:', error);
		throw error;
	}
}

export async function decrementProfileSupportBalance(ProfileId: string, amount: number): Promise<void> {
	try {
		const Profile: Profile | null = await db.profile.findUnique({
			where: {
				id: ProfileId,
			},
		});

		// If Profile not found, throw an error
		if (!Profile) {
			throw new Error('Profile not found');
		}

		if (amount > Profile.balance) {
			throw new Error('Amount must be less than profile.balance');
		}

		// Update the Profile's balance by adding the amount
		const updatedProfile = await db.profile.update({
			where: {
				id: ProfileId,
			},
			data: {
				balance: Profile.balance - amount,
			},
		});

		// Log the updated Profile's balance
		console.log(`Profile balance updated: ${updatedProfile.balance}`);
	} catch (error) {
		// Handle errors
		console.error('Error updating Profile balance:', error);
		throw error;
	}
}
