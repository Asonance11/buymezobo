import { SignUp } from '@clerk/nextjs';

export default function Page() {
	return (
		<section className="min-h-dvh flex flex-col items-center justify-between">
			<div className="w-full h-20 bg-white"></div>
			<SignUp />
			<div className="w-full h-20 bg-white"></div>
		</section>
	);
}
