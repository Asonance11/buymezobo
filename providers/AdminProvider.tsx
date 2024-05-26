import { useAuth } from '@/actions/use-auth';
import Loading from '@/app/(admin)/loading';
import { User } from 'lucia';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminProvider({ children }: { children: React.ReactNode }) {
	const [profile, setProfile] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchProfile = async () => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
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

	if (!profile) router.push('/signin');

	if (profile && !profile.userName) router.push('/aftersignup');

	return children;
}
