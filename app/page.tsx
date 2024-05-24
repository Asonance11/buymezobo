/* eslint-disable react/no-unescaped-entities */
'use client';
import MainHeader from '@/components/common/MainHeader';
import { Button } from '@/components/ui/button';
import { InterTight } from '@/utility/fonts';
import Link from 'next/link';
import { useAuth as Auth } from '@/actions/use-auth';
import { useEffect, useState } from 'react';
import { User } from 'lucia';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/store/UserDataStore';
import Script from 'next/script';

export default function Home() {
	const [profile, setProfile] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const { updateUser, user: USerr } = useUser();

	useEffect(() => {
		const fetchProfile = async () => {
			setLoading(true);
			//INFO: an error here about a hook,, because it starts with use, in a function.
			const { user } = await Auth();
			updateUser(user);
			setProfile(user);
			setLoading(false);
		};
		fetchProfile();
		console.log('FROM APP/PAGE: ', USerr);
	}, []);

	if (profile) {
		//redirect(`/dashboard`)
	}

	return (
		<main className="min-h-dvh flex flex-col">
			<script
				src="https://cdn.statically.io/gh/shadow-wizards/static/main/bmz/widget.prod.js"
				data-name="BMC-Widget"
				data-cfasync="false"
				data-id="buymezobo"
				data-description="buy me some fucking zobo!"
				data-message=""
				data-color="#7C3BED"
				async
				data-position="Right"
				data-x_margin="18"
				data-y_margin="18"
			></script>
			<MainHeader />
			<section className="flex flex-col items-center justify-center grow">
				<div className="lg:w-2/3 xl:w-[40%] mx-auto p-2 lg:p-6 flex items-center justify-center flex-col gap-2 lg:gap-3 text-center rounded-lg lg:shadow-sm">
					<div className="w-16 h-7 lg:w-40 lg:h-12 bg-black"></div>
					<h1
						className={`text-4xl md:text-6xl lg:text-8xl  dark:text-neutral-400  text-neutral-800 mb-4 lg:mb-6 text-center -tracking-wider font-bold ${InterTight.className} `}
					>
						Fund your creative work
					</h1>
					<p className="text-sm lg:text-lg font-semibold text-gray-800">
						Accept support. Start a membership. Setup a shop. It's easier than you think.
					</p>
					{loading ? (
						<Skeleton className="p-3 lg:p-6 text-base lg:text-xl bg-purple-300 font-semibold w-[200px] h-[40px]" />
					) : (
						<Link href={profile ? '/dashboard' : '/signin'}>
							<Button className="p-3 lg:p-6 text-base lg:text-xl font-semibold">
								{profile ? 'Go to dashboard' : 'Start my page'}
							</Button>
						</Link>
					)}
					<p className="text-xs lg:text-base font-light text-gray-600">
						It's free and takes less than a minute!
					</p>
				</div>
			</section>
			<section className="bg-green-800 flex flex-col items-center justify-center "></section>
		</main>
	);
}
