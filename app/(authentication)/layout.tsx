'use client';

import bg from '/public/images/authbg.svg';
import Loading from './loading';
import { useAuth } from '@/actions/use-auth';
import { useEffect, useState } from 'react';
import { User } from 'lucia';
import { useRouter, usePathname } from 'next/navigation';

export default function ClerkLayout({ children }: { children: React.ReactNode }) {
	const [profile, setProfile] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const fetchProfile = async () => {
			const { user } = await useAuth();
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

	return <section className="min-h-dvh bg-white">{children}</section>;
}
