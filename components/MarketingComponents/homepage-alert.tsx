import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utility/style';

export function HomepageAlertButton() {
	return (
		<div className="z-10 flex items-center justify-center">
			<AnimatedGradientText>
				🎉 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{' '}
				<span
					className={cn(
						` text-xs lg:text-sm inline animate-gradient bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
					)}
				>
					We are almost set to launch!{' '}
				</span>
				<ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 inline" />
			</AnimatedGradientText>
		</div>
	);
}
