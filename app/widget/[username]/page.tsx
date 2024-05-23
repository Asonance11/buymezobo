'use client';
import React, { useEffect, useState } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { User } from 'lucia';
import { getCreatorByName } from '@/lib/creator';
import BuyCard from '@/app/[username]/_components/BuyCard';
import { useOrigin } from '@/hooks/useOrigin';
import Link from 'next/link';
import { truncateText } from '@/utility/text';

interface Props {
	params: { username: string };
}

export default function Page({ params }: Props) {
	const [profile, setProfile] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const origin = useOrigin();
	const searchParams = useSearchParams();

	const color = searchParams.get('color') || '#000000';
	const description = searchParams.get('description') || 'Buy me Zobo';

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const user = await getCreatorByName(params.username);
				console.log('Fetched user:', user); // Debugging log
				setProfile(user);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching profile:', error);
				setLoading(false);
			}
		};

		fetchProfile();
	}, [params.username]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!profile) {
		return notFound();
	}

	const inviteUrl = `${origin}/${profile.userName}`;

	return (
		<div className="w-full flex flex-col items-center min-h-screen justify-between">
			<BuyCard creator={profile} className={`${color}`} />
			<div className="w-full p-4 shadow-xl flex items-center justify-center">
				{
					<Link href={inviteUrl} target="_blank">
						<div className="bg-zinc-200 px-4 py-2 rounded-lg font-bold text-zinc-600">
							{truncateText(`buymezobo.ng/${profile.userName}`, 20)}
						</div>
					</Link>
				}
			</div>
		</div>
	);
}
