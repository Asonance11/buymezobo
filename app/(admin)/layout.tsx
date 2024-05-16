'use client';
import Sidebar from '@/components/Sidebar/Sidebar';
import AdminHeader from '@/components/common/AdminHeader';
import Loading from './loading';
import { useAuth } from '@/actions/use-auth';
import { useEffect, useState } from 'react';
import { User } from 'lucia';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const [profile, setProfile] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

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
				<Loading />;
			</main>
		);
	}

	if (!profile) {
		router.push('/signin');
		return null;
	}

	return (
		<section className="max-h-screen bg-black flex">
			<Sidebar />
			<main className="flex-1 min-h-dvh bg-zinc-100 flex flex-col">
				<AdminHeader />
				<section className="flex-1 max-h-screen overflow-y-scroll scrollbar-hide">{children}</section>
			</main>
		</section>
	);
}
