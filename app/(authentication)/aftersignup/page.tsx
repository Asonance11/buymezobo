'use client';

import { createInitialProfile } from '@/lib/authentication';
import { UserAfterform } from '../_components/UserAfterForm';
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useAuth } from '@/actions/use-auth';
import { useEffect, useState } from 'react';
import { User } from 'lucia';

/*
    from here we want the name, back account number and bank code  
*/

export default async function Page() {
	const [profile, setProfile] = useState<User | null>(null);
	useEffect(() => {
		const fetchProfile = async () => {
			const { user: myProfile } = await useAuth();
			if (!myProfile) redirect('/signin');
			setProfile(myProfile);
		};
		fetchProfile();
	}, []);

	console.log(profile);
	if (!profile) {
		<RedirectToSignIn />;
	}
	if (profile?.userName) {
		redirect('/dashboard');
	}

	return (
		<section className="w-full md:w-5/6 mx-auto  lg:w-1/2 min-h-dvh flex flex-col justify-center items-center">
			<UserAfterform />
		</section>
	);
}
