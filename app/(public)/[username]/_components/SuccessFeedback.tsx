import React from 'react';
import Lottie from 'lottie-light-react';
import lottieJson from '@/components/lottieanimations/fiillzoboanimation.json';
import successAnimation from '@/components/lottieanimations/fireworksanimation.json';
import { CommandDialog } from '@/components/ui/command';
import { shadowLight } from '@/utility/fonts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';
import { useUser } from '@/store/UserDataStore';

export default function SuccessFeedback({ open, onClose }: { open: boolean; onClose: () => void }) {
	const { loggedInUser } = useUser();
	return (
		<CommandDialog open={open} onOpenChange={onClose}>
			<div className="relative w-full h-full flex flex-col items-center justify-center p-4">
				<div>
					<div className="absolute inset-0 flex justify-center items-center w-full">
						<Lottie
							animationData={successAnimation}
							//speed={0.7}
							// play
							loop={false}
							style={{ width: 200, height: 200 }}
							className="block mx-auto"
						/>
					</div>
					<div className="flex items-center justify-center w-full">
						<p
							className={`text-2xl lg:text-3xl tracking-normal font-extrabold ${shadowLight.className} relative z-20`}
						>
							Thanks for your support
						</p>
						<div className="w-[100px] relative -left-8 bg-transparent">
							<Lottie
								loop
								animationData={lottieJson}
								// play
								style={{ width: 200, height: 150, backgroundColor: 'transparent' }}
							/>
						</div>
					</div>
				</div>

				<div>
					<Link href={loggedInUser ? '/dashboard' : '/signin'} className="">
						<Button className="p-1.5 md:p-3 my-1 lg:p-6 text-sm lg:text-base font-semibold group inline-flex items-center rounded-md">
							{loggedInUser ? 'Go to dashboard' : 'create my page'}{' '}
							<ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
						</Button>
					</Link>
				</div>
			</div>
		</CommandDialog>
	);
}
