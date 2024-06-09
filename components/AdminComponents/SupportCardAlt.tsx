import { SupportPrimitive } from '@/types/primitives';
import { cn } from '@/utility/style';
import { HTMLAttributes } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import ProfileCardComponent from '../Profile/ComponentCard';
import { truncateText } from '@/utility/text';
import { avatarImageUrl } from '@/utility/avatar';

interface Props extends HTMLAttributes<HTMLDivElement> {
	support: SupportPrimitive;
}

export const SupportCardAlt = ({ support }: Props) => {
	return (
		<figure
			className={cn(
				'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 ',
				// light styles
				'border-gray-950/[.1] bg-white hover:bg-gray-200',
				// dark styles
				'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
			)}
		>
			<div className="flex flex-row items-center gap-2 ">
				{support.supporter ? (
					<HoverCard>
						<HoverCardTrigger>
							<div
								className="cursor-pointer rounded-lg w-10 lg:w-9 h-10 lg:h-9 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
								style={{ backgroundImage: `url(${avatarImageUrl(support.supporter)})` }}
							></div>
						</HoverCardTrigger>
						<HoverCardContent className="p-0">
							<ProfileCardComponent profile={support.supporter} />
						</HoverCardContent>
					</HoverCard>
				) : (
					<div className="hidden md:flex cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat bg-black"></div>
				)}
				<div className="flex flex-col">
					<figcaption className="text-sm font-medium dark:text-white">
						{support.supporter?.userName || support.name}
					</figcaption>
					<p className="text-xs font-medium dark:text-white/40">Bought {support.numberOfZobo} zobo</p>
				</div>
			</div>
			<blockquote className="mt-2 text-xs">{truncateText(support.content, 30)}</blockquote>
		</figure>
	);
};
