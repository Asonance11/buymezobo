'use client';
import DashBoardEarningPage from '@/components/AdminComponents/DashBoardEarningPage';
import PostPage from '@/components/AdminComponents/PostPage';
import SupportHistory from '@/components/AdminComponents/SupportHistoryPage';
import { useUser } from '@/store/UserDataStore';
import React from 'react';

export default function Page() {
	const { loggedInUser: profile } = useUser();

	return (
		<main className="w-[99%] md:w-full h-full transition-all duration-300">
			<section className="w-full min-h-full pb-20 md:w-5/6 lg:w-4/5 mx-auto p-5 grid grid-cols-3 gap-4 bg-red-600 content-start">
				<DashBoardEarningPage profile={profile}className='col-span-2'   />
				<SupportHistory creator={profile} className='col-span-2' />
				<PostPage creator={profile} />
			</section>
		</main>
	);
}
