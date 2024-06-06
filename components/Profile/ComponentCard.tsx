import { ProfileTagsOptions } from '@/lib/tagsOptions';
import { truncateText } from '@/utility/text';
import { Profile } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

interface Props {
	profile: Profile;
}

export default function ProfileCardComponent({ profile }: Props) {
	const getTagLabel = (tagValue: string) => {
		const tagOption = ProfileTagsOptions.find((option) => option.value === tagValue);
		return tagOption ? tagOption.label : tagValue; // Return the tag value if no match is found
	};

	return (
		<div className="p-3 space-y-4">
			<div
				className="w-full h-20 bg-gray-300 bg-center bg-cover bg-no-repeat relative rounded-sm"
				style={{ backgroundImage: `url(${profile?.headerImageUrl})` }}
			>
				<div
					className="cursor-pointer rounded-lg w-5 lg:w-11 h-5 lg:h-11 bg-center bg-cover bg-no-repeat border-1 border-purple-300 absolute left-2 -bottom-4"
					style={{ backgroundImage: `url(${profile!.imageUrl})` }}
				></div>
			</div>

			<div>
				<Link href={`/${profile.userName}`} target="_blank">
					<p className="font-semibold text-sm hover:underline">{profile.userName}</p>
				</Link>
				<p className="font-light text-xs">{truncateText(profile.bio ? profile.bio : '', 70)}</p>
			</div>
			<div className="p-1">
				{profile.tags.slice(0, 2).map((tag) => {
					const encodedTag = encodeURIComponent(tag);
					const tagLabel = getTagLabel(tag);

					return (
						<a key={tag} href={`/explore?category=${encodedTag}`} target="_blank">
							<div className="text-xs font-semibold p-1.5 text-gray-500 bg-gray-100 rounded-sm w-fit">
								{tagLabel}
							</div>
						</a>
					);
				})}{' '}
			</div>
		</div>
	);
}
