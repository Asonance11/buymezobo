/* eslint-disable react/no-unescaped-entities */
'use client';
import MainHeader from '@/components/Headers/MainHeader';
import { Button } from '@/components/ui/button';
import { helvetica } from '@/utility/fonts';
import Link from 'next/link';
import { useAuth as Auth } from '@/actions/use-auth';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/store/UserDataStore';
import { HomePageWords } from '@/lib/magicui';
import { HomepageAlertButton } from '@/components/MarketingComponents/homepage-alert';
import WordRotate from '@/components/magicui/word-rotate';
import BlurEffect from './(authentication)/_components/BlurEffect';
import { ChevronRightIcon } from 'lucide-react';

export default function Home() {
	// const [profile, setProfile] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const { updateUser, loggedInUser } = useUser();

	useEffect(() => {
		const fetchProfile = async () => {
			if (!loggedInUser) {
				setLoading(true);
				const { user } = await Auth();
				updateUser(user);
			}
			setLoading(false);
		};
		fetchProfile();
	}, []);

	return (
		<main className="absolute w-full min-h-dvh flex flex-col overflow-hidden">
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
			<BlurEffect />
			<section className="flex flex-col items-center justify-center grow">
				<div className="lg:w-3/4 xl:w-[60%] mx-auto p-2 lg:p-6 flex items-center justify-center flex-col gap-2 lg:gap-2 text-center rounded-lg lg:shadow-sm space-y-2">
					<HomepageAlertButton />
					<h1
						className={`text-4xl/none md:text-6xl lg:text-7xl  dark:text-neutral-400  text-neutral-800 text-center -tracking-wider font-bold leading-none ${helvetica.className} `}
					>
						Support {' '}
						{loading ? (
							<p className="block"> {HomePageWords[0]}</p>
						) : (
							<WordRotate className="block" words={HomePageWords} />
						)}
					</h1>
					<p className="text-sm lg:text-lg font-normal text-gray-500 w-full md:w-3/5">
						Seamlessly Receive Support, Build a Fan Base, and Retail Your Products, it's easier than you
						think, it's free and takes less than a minute!
					</p>
					{loading ? (
						<Skeleton className="p-3 lg:p-6 text-base lg:text-xl bg-purple-300 font-semibold w-[150px] h-[40px]" />
					) : (
						<Link href={loggedInUser ? '/dashboard' : '/signin'}>
							<Button className="p-1.5 md:p-3 my-1 lg:p-6 text-sm lg:text-base font-semibold group inline-flex items-center rounded-md">
								{loggedInUser ? 'Go to dashboard' : 'Start my page'}{" "}
								<ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
							</Button>
						</Link>
					)}
				</div>
			</section>
			<section className="bg-green-800 flex flex-col items-center justify-center "></section>
		</main>
	);
}
