import { ProfileTagsOptions } from '@/lib/tagsOptions';
import { useInterface } from '@/store/InterfaceStore';
import { cn } from '@/utility/style';
import { truncateText } from '@/utility/text';
import { Profile } from '@prisma/client';
import { User } from 'lucia';
import { EditIcon } from 'lucide-react';
import Link from 'next/link';
import React, { HTMLAttributes } from 'react';
import { CiEdit } from 'react-icons/ci';

interface Props extends HTMLAttributes<HTMLDivElement> {
	profile: Profile;
}

export default function ProfileCardComponent({ profile, className }: Props) {
	const getTagLabel = (tagValue: string) => {
		const tagOption = ProfileTagsOptions.find((option) => option.value === tagValue);
		return tagOption ? tagOption.label : tagValue; // Return the tag value if no match is found
	};

	const { onOpen } = useInterface();

	return (
		<div className={cn(`p-3 space-y-4 bg-white flex flex-col justify-between rounded-lg`, className)}>
			<div className="flex flex-col gap-6">
				<div
					className="w-full h-24 bg-gray-300 bg-center bg-cover bg-no-repeat relative rounded-sm"
					style={{ backgroundImage: `url(${profile?.headerImageUrl})` }}
				>
					<div
						className="absolute top-1 right-2 bg-purple-400 p-0.5 rounded-sm cursor-pointer"
						onClick={() => onOpen('editUsernamePage', { creator: profile as User })}
					>
						<CiEdit className=" font-bold w-6 h-6" />
					</div>
					<div
						className="cursor-pointer rounded-lg w-5 lg:w-16 h-5 lg:h-16 bg-center bg-cover bg-no-repeat border-1 border-purple-300 absolute left-2 -bottom-6"
						style={{ backgroundImage: `url(${profile!.imageUrl})` }}
					></div>
				</div>

				<div className="space-y-1">
					<Link href={`/${profile.userName}`} target="_blank">
						<p className="font-semibold text-sm hover:underline">{profile.userName}</p>
					</Link>
					<p className="font-light text-xs">{truncateText(profile.bio ? profile.bio : '', 70)}</p>
				</div>
			</div>
			<div className="p-1 flex gap-1 overflow-hidden">
				{profile.tags.slice(0, 5).map((tag) => {
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
