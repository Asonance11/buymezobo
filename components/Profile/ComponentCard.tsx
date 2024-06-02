import { truncateText } from '@/utility/text';
import { Profile } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

interface Props {
	profile: Profile;
}

export default function ProfileCardComponent({ profile }: Props) {
	return (
		<div className="p-3 space-y-4">
			<div
				className="w-full h-20 bg-gray-300 bg-center bg-cover bg-no-repeat relative "
				style={{ backgroundImage: `url(${profile?.headerImageUrl})` }}
			>
				<div
					className="cursor-pointer rounded-lg w-5 lg:w-12 h-5 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300 absolute -bottom-4"
					style={{ backgroundImage: `url(${profile!.imageUrl})` }}
				></div>
			</div>

			<div>
				<Link href={`/${profile.userName}`} target="_blank">
					<p className="font-semibold text-sm hover:underline">{profile.userName}</p>
				</Link>
				<p className="font-light text-xs">{truncateText(profile.bio ? profile.bio : '', 70)}</p>
			</div>
		</div>
	);
}
