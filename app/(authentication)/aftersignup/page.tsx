'use client';

import { UserAfterform } from '../_components/UserAfterForm';
import { redirect } from 'next/navigation';
import { useAuth as getAuth } from '../../../actions/use-auth';
import { useEffect, useState } from 'react';
import { User } from 'lucia';

/*
    from here we want the name, back account number and bank code  
*/

// TODO: Set First and Last names as well

export default function Page() {
	const [profile, setProfile] = useState<User | null>(null);
	useEffect(() => {
		const fetchProfile = async () => {
			const { user } = await getAuth();
			setProfile(user);
		};
		fetchProfile();
	}, []);

	// if (!profile) {
	// 	redirect('/signin');
	// }

	// if (profile?.bankName) {
	// 	redirect('/dashboard');
	// }

	return (
		<section className="w-full md:w-5/6 mx-auto  lg:w-1/2 min-h-dvh flex flex-col justify-center items-center">
			<UserAfterform />
		</section>
	);
}
