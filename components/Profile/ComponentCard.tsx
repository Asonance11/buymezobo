import { getCreatorByName } from '@/lib/creator';
import { ProfileTagsOptions } from '@/lib/tagsOptions';
import { useInterface } from '@/store/InterfaceStore';
import { useUser } from '@/store/UserDataStore';
import { avatarImageUrl } from '@/utility/avatar';
import { cn } from '@/utility/style';
import { truncateText } from '@/utility/text';
import { Profile } from '@prisma/client';
import { User } from 'lucia';
import { EditIcon, UserPlus } from 'lucide-react';
import Link from 'next/link';
import React, { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import Loader from '../common/Loader';
import { ProfilePrimitive } from '@/types/primitives';
import Marquee from '../magicui/marquee';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { FollowButton } from '@/app/(public)/[username]/_components/FollowButton';

export function HoverProfileCardOnHover({ children, profile }: { children: ReactNode; profile: Profile }) {
	return (
		<HoverCard>
			<HoverCardTrigger>{children}</HoverCardTrigger>
			<HoverCardContent className="p-0">
				<ProfileCardComponent profile={profile} />
			</HoverCardContent>
		</HoverCard>
	);
}

interface Props extends HTMLAttributes<HTMLDivElement> {
	profile: Profile;
	showFollowingStats?: boolean;
}

export default function ProfileCardComponent({ showFollowingStats = true, profile, className }: Props) {
	const getTagLabel = (tagValue: string) => {
		const tagOption = ProfileTagsOptions.find((option) => option.value === tagValue);
		return tagOption ? tagOption.label : tagValue; // Return the tag value if no match is found
	};

	const [user, setUser] = useState<ProfilePrimitive | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchUser = async (name: string) => {
			setLoading(true);
			const user = await getCreatorByName(name);
			setUser(user as ProfilePrimitive | null);
			setLoading(false);
		};

		if (profile.userName) {
			fetchUser(profile.userName);
		}
	}, [profile.id, profile.userName]);

	const { loggedInUser } = useUser();

	const { onOpen } = useInterface();

	if (!user || loading) {
		return (
			<div className="w-full h-full flex items-center justify-center min-h-40">
				<Loader />
			</div>
		);
	}

	return (
		<div className={cn(`p-2 space-y-4 bg-white flex flex-col justify-between rounded-lg min-w-72`, className)}>
			<div className="flex flex-col gap-6">
				<div
					className="w-full h-24 bg-gray-300 bg-center bg-cover bg-no-repeat relative rounded-sm"
					style={{ backgroundImage: `url(${user?.headerImageUrl})` }}
				>
					{loggedInUser?.id === user.id && false ? (
						<div
							className="absolute top-1 right-2 bg-purple-400 p-0.5 rounded-sm cursor-pointer"
							onClick={() => onOpen('editUsernamePage', { creator: user as User })}
						>
							<CiEdit className=" font-bold w-6 h-6" />
						</div>
					) : null}
					<div
						className="cursor-pointer rounded-lg w-5 lg:w-16 h-5 lg:h-16 bg-center bg-cover bg-no-repeat border-1 border-purple-300 absolute left-2 -bottom-6"
						style={{ backgroundImage: `url(${avatarImageUrl(user)})` }}
					></div>
				</div>

				<div className="space-y-1">
					<Link href={`/${user.userName}`} target="_blank">
						<p className="font-semibold text-sm hover:underline">@{user.userName}</p>
					</Link>
					<p className="font-light text-xs">{truncateText(user.bio ? user.bio : '', 70)}</p>
				</div>
			</div>
			<div className="p-1 flex gap-1 overflow-auto ">
				<Marquee pauseOnHover className=" w-full [--duration:20s] ">
					{user.tags.slice(0, 5).map((tag) => {
						const encodedTag = encodeURIComponent(tag);
						const tagLabel = getTagLabel(tag);

						return (
							<a key={tag} href={`/explore?category=${encodedTag}`} target="_blank">
								<div className="text-[0.7rem] font-semibold p-1.5 text-gray-500 bg-gray-100 rounded-sm w-fit">
									{tagLabel}
								</div>
							</a>
						);
					})}{' '}
				</Marquee>
			</div>
			<div className="p-1.5 text-xs flex items-center justify-between text-gray-600 font-light">
				<div className="flex items-center justify-start gap-3">
					{showFollowingStats && (
						<>
							<p>{user.following?.length} following</p>
							<p>{user.followers?.length} followers</p>
						</>
					)}
				</div>

				{loggedInUser?.id !== user.id && (
					<div>
						<FollowButton followingId={user.id} />
					</div>
				)}
			</div>
		</div>
	);
}
