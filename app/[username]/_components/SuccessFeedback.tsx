import React from 'react';
import Lottie from 'react-lottie-player';
import lottieJson from '../../../components/lottieanimations/fiillzoboanimation.json';
import successAnimation from '../../../components/lottieanimations/fireworksanimation.json';
import { CommandDialog } from '@/components/ui/command';
import { shadowLight } from '@/utility/fonts';

export default function SuccessFeedback({ open, onClose }: { open: boolean; onClose: () => void }) {
	return (
		<CommandDialog open={open} onOpenChange={onClose}>
			<div className="relative w-full h-full">
				<div className="absolute inset-0 flex justify-center items-center w-full">
					<Lottie
						animationData={successAnimation}
						play
						speed={0.7}
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
							play
							style={{ width: 200, height: 150, backgroundColor: 'transparent' }}
						/>
					</div>
				</div>
			</div>
		</CommandDialog>
	);
}
