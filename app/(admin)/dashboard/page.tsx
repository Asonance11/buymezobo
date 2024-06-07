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
			<section className="w-full min-h-full pb-20 md:w-5/6 lg:w-4/5 mx-auto p-3 md:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[180px] md:auto-rows-[250px] content-start">
				<DashBoardEarningPage profile={profile} className="col-span-1 md:col-span-3 xl:col-span-2 max-w-full" />
				<SupportHistory creator={profile} className="order-2 lg:order-3 row-span-1 lg:row-span-2 md:col-span-2 max-h-full max-w-full " />
				<PostPage
					creator={profile}
					className="row-span-2 md:col-span-2 lg:col-span-1 md:row-span-1 order-3 lg:order-2 "
				/>
			</section>
		</main>
	);
}
