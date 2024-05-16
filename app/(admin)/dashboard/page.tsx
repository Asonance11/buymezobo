'use client';
import DashBoardEarningPage from '@/components/AdminComponents/DashBoardEarningPage';
import SupportHistoryPage from '@/components/AdminComponents/SupportHistoryPage';
import MainHeader from '@/components/common/MainHeader';
import { getCurrentUser } from '@/lib/authentication';
import { User } from 'lucia';
import React, { Suspense, useEffect, useState } from 'react';

export default function Page() {
	const [profile, setProfile] = useState<User | null>(null);
	useEffect(() => {
		const getUser = async () => {
			const profile = await getCurrentUser();
			if (profile) {
				setProfile(profile);
			}
		};
		getUser();
	}, []);

	return (
		<main className="w-[99%] md:w-full h-full transition-all duration-300">
			<section className="w-full h-full md:w-5/6 lg:w-3/5 mx-auto p-5 flex flex-col gap-4">
				<DashBoardEarningPage profile={profile} />
				<SupportHistoryPage creator={profile} />
			</section>
		</main>
	);
}
