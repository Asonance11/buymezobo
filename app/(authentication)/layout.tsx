'use client';

import bg from '/public/images/authbg.svg';
import Loading from './loading';
import { useAuth as getAuth } from '@/actions/use-auth';
import { useEffect, useState } from 'react';
import { User } from 'lucia';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import dashboardScreenShot from '../../assets/dashboard-screenshot.png';
import buttonsAndGraphics from '../../assets/buttons-graphics-screenshot.png';

export default function ClerkLayout({ children }: { children: React.ReactNode }) {
	const [profile, setProfile] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const fetchProfile = async () => {
			const { user } = await getAuth();
			setProfile(user);
			setLoading(false);
		};
		fetchProfile();
	}, []);

	if (loading) {
		return (
			<main className="min-h-dvh flex flex-col">
				<Loading />
			</main>
		);
	}

	if (profile) {
		if (pathname.includes('/aftersignup') && !profile.userName) {
			return <section className="min-h-dvh bg-white">{children}</section>;
		}
		router.push('/dashboard');
		return null;
	}

	return (
		<section className=" w-[100vw] h-[100vh] flex justify-between items-center">
			<div className=" relative w-[50vw] h-full hidden lg:flex overflow-hidden flex-col items-center px-10 py-7 gap-12 bg-purple-200 text-slate-800">
				<p className=" mt-[25%]">
					<h1 className=" text-lg md:text-xl lg:text-2xl font-bold tracking-tighter">
						Empower Your Creativity.{' '}
					</h1>
					<p className=" text-xs md:text-sm mt-1.5 lg:mt-3">
						Join us now to connect with your supporters, share your journey, and fuel your creativity.
						Engage with your audience, receive donations, and turn your passion into a thriving endeavor.
						Your community is ready to back you—let us make something incredible together!
					</p>
				</p>
				<Image
					src={buttonsAndGraphics}
					alt="buttons and graphics screenshot"
					className=" opacity-1 h-auto w-[80vw] absolute bottom-[15%] left-[10%] rounded-sm border-solid border-4 border-slate-900"
				/>
				<Image
					src={dashboardScreenShot}
					alt="dashboard screenshot"
					className=" opacity-1 h-auto w-[80vw] absolute bottom-[-5%] left-[20%] rounded-sm border-solid border-4 border-slate-900 z-2"
				/>
			</div>
			<section className="w-full h-full flex justify-between items-center">{children}</section>
		</section>
	);
}
