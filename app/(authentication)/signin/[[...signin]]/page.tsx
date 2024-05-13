import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign In',
};
export default function Page() {
	return (
		<section className="min-h-dvh flex flex-col items-center justify-between">
			<div className="w-full h-20 bg-white"></div>
			<SignIn />
			<div className="w-full h-20 bg-white"></div>
		</section>
	);
}
