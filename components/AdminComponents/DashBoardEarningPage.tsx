import { cn } from '@/utility/style';
import React, { HTMLAttributes } from 'react';
import SharePage from '../Profile/SharePage';
import { formatNumberWithCommas } from '@/utility/text';
import { User } from 'lucia';
import { avatarImageUrl } from '@/utility/avatar';
import { Profile } from '@prisma/client';

interface Props extends HTMLAttributes<HTMLDivElement> {
	profile: User | null;
}

export default function DashBoardEarningPage({ profile, className }: Props) {
	const nairaSymbol = '₦';
	if (!profile) {
		return null;
	}
	return (
		<div
			className={cn(
				`py-4 px-3 lg:py-6 lg:px-5 transition-all flex flex-col justify-between duration-300 rounded-lg bg-white h-full overflow-hidden relative`,
				className,
			)}
		>
			<div className="flex items-center gap-2 h-2/5 ">
				<div
					className="cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat"
					style={{ backgroundImage: `url(${avatarImageUrl(profile as Profile)})` }}
				></div>
				<div className="flex-1">
					<p className="text-sm lg:text-xl font-semibold tracking-tight">
						Hi, {profile.firstName || profile.userName}
					</p>
					<p className="font-light text-xs md:text-sm text-zinc-700">buymezobo.com/{profile.userName}</p>
				</div>
				<SharePage className="hidden md:flex text-xs lg:text-sm" profile={profile} />
			</div>
			<div className="flex flex-col justify-center items-start gap-2 flex-1 ">
				<div className="flex items-center justify-start gap-3">
					<p className="text-sm lg:text-base">Earning</p>
					<div className="w-12 h-5 lg:w-20 lg:h-7 bg-black"></div>
				</div>
				<p className="text-3xl -tracking-wide md:text-5xl lg:text-6xl font-bold">
					{nairaSymbol}
					{formatNumberWithCommas(profile.balance)}
				</p>
			</div>
		</div>
	);
}
