/* eslint-disable react/no-unescaped-entities */
'use client';
import MainHeader from '@/components/common/MainHeader';
import { Button } from '@/components/ui/button';
import { InterTight, helvetica } from '@/utility/fonts';
import Link from 'next/link';
import { useAuth as Auth } from '@/actions/use-auth';
import { useEffect, useState } from 'react';
import { User } from 'lucia';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/store/UserDataStore';
import Script from 'next/script';
import StyledDiv, { StyledDiv2 } from '@/components/styles/Gradient';
import { FaArrowRightLong } from 'react-icons/fa6';
import WordRotate from '@/components/magicui/word-rotate';
import { HomePageWords } from '@/lib/magicui';
import { HomepageAlertButton } from '@/components/MarketingComponents/homepage-alert';

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

	//<WordRotate className="block" words={HomePageWords} />

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
			<div className="pointer-events-none absolute inset-x-0 transform-gpu overflow-hidden blur-3xl sm:-top-80">
				<StyledDiv />
				<StyledDiv2 />
			</div>
			<section className="flex flex-col items-center justify-center grow">
				<div className="lg:w-3/4 xl:w-[60%] mx-auto p-2 lg:p-6 flex items-center justify-center flex-col gap-2 lg:gap-2 text-center rounded-lg lg:shadow-sm space-y-2">
					<HomepageAlertButton />
					<h1
						className={`text-4xl/none md:text-6xl lg:text-8xl  dark:text-neutral-400  text-neutral-800 text-center -tracking-wider font-bold leading-none ${helvetica.className} `}
					>
						Fund your {HomePageWords[0]}
					</h1>
					<p className="text-xs lg:text-base font-semibold text-gray-500 ">
						Accept support. Start a membership. Setup a shop. It's easier than you think.
					</p>
					{loading ? (
						<Skeleton className="p-3 lg:p-6 text-base lg:text-xl bg-purple-300 font-semibold w-[200px] h-[40px]" />
					) : (
						<Link href={profile ? '/dashboard' : '/signin'}>
							<Button className="p-3 lg:p-4 text-base rounded-sm lg:text-base font-semibold">
								{profile ? 'Go to dashboard' : 'Start my page'}
							</Button>
						</Link>
					)}
					<p className="text-xs lg:text-base font-light text-gray-500">
						It's free and takes less than a minute!
					</p>
				</div>
			</section>
			<section className="bg-green-800 flex flex-col items-center justify-center "></section>
		</main>
	);
}
