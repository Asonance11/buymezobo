'use client';

import { UserAfterform } from '../_components/UserAfterForm';
/*
    from here we want the name, back account number and bank code  
*/

// TODO: Set First and Last names as well

export default function Page() {
	return (
		<section className="w-full md:w-5/6 mx-auto  lg:w-1/2 min-h-dvh flex flex-col justify-center items-center">
			<UserAfterform />
		</section>
	);
}
