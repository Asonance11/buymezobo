import PayoutEarningPage from '@/components/AdminComponents/PayoutEarningPage';
import { getCurrentUser } from '@/lib/authentication';
import React from 'react';

export default async function page() {
	const profile = await getCurrentUser();
	if (!profile) {
		return null;
	}
	return (
		<main className="w-full h-full transition-all duration-300">
			<section className="h-full md:w-5/6 lg:w-3/5 mx-auto p-5 flex flex-col gap-4">
				<PayoutEarningPage profile={profile} />
			</section>
		</main>
	);
}
