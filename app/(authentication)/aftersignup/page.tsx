import { createInitialProfile } from '@/lib/authentication';
import { UserAfterform } from '../_components/UserAfterForm';
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

/*
    from here we want the name, back account number and bank code  
*/

export default async function Page() {
	const profile = await createInitialProfile();

	console.log(profile);
	if (!profile) {
		<RedirectToSignIn />;
	}
	if (profile?.userName) {
		redirect('/');
	}
	return (
		<section className="w-full md:w-5/6 mx-auto  lg:w-1/2 min-h-dvh flex flex-col justify-center items-center">
			<UserAfterform />
		</section>
	);
}
