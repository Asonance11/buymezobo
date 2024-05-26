'use client';

import { useUser } from '@/store/UserDataStore';
import { UserAfterform } from '../_components/UserAfterForm';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Loading from '../loading';
/*
    from here we want the name, back account number and bank code  
*/

// TODO: Set First and Last names as well

export default function Page() {
	const { signedIn, loggedInUser } = useUser();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		function confirmation() {
			if (!signedIn) {
				redirect('/signin');
			}
			if (loggedInUser?.bankAccountName) {
				redirect('/dashboard');
			}
			setLoading(false);
		}
		confirmation();
	}, [loggedInUser, signedIn]);
	return (
		<section className="w-full md:w-5/6 mx-auto  lg:w-1/2 min-h-dvh flex flex-col justify-center items-center">
			{loading ? <Loading /> : <UserAfterform />}
		</section>
	);
}
