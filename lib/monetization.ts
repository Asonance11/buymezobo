import { db } from '@/lib/database';
import { Profile } from '@prisma/client';

export const BUYMEZOBO_PLATFORM_PERCENTAGE = 5; // Constant for platform percentage

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
