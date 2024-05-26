'use client';
import DashBoardEarningPage from '@/components/AdminComponents/DashBoardEarningPage';
import PostPage from '@/components/AdminComponents/PostPage';
import SupportHistoryPage from '@/components/AdminComponents/SupportHistoryPage';
import { useUser } from '@/store/UserDataStore';
import React from 'react';

export default function Page() {
	const { loggedInUser: profile } = useUser();

	return (
		<main className="w-[99%] md:w-full h-full transition-all duration-300">
			<section className="w-full h-full md:w-5/6 lg:w-3/5 mx-auto p-5 flex flex-col gap-4">
				<DashBoardEarningPage profile={profile} />
				<SupportHistoryPage creator={profile} />
				<PostPage creator={profile} />
			</section>
		</main>
	);
}
