import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { cn } from '@/utility/style';
import { MdOutlineLocationOn } from 'react-icons/md';

export function AboutLocationButton() {
	return (
		<div className="z-10 flex items-center justify-center cursor-pointer">
			<AnimatedGradientText>
				<MdOutlineLocationOn className="xl" />
				<hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{' '}
				<span
					className={cn(
						` text-xs lg:text-sm inline animate-gradient bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
					)}
				>
					Lagos, Nigeria
				</span>
			</AnimatedGradientText>
		</div>
	);
}
