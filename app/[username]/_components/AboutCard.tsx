import { SocialMediaIcon } from '@/components/Profile/SocialMediaLinkComponent';
import { Button } from '@/components/ui/button';
import { getCreatorByName } from '@/lib/creator';
import queryKeys from '@/query-key-factory';
import { useInterface } from '@/store/InterfaceStore';
import { useUser } from '@/store/UserDataStore';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { ProfileTagsOptions } from '@/lib/tagsOptions';
import { FiEdit } from 'react-icons/fi';

interface Props {
	creatorname: string;
}

export const AboutCard = ({ creatorname }: Props) => {
	const { onOpen } = useInterface();
	const [isTheSameUser, setIsTheSameUser] = useState(false);

	const { loggedInUser } = useUser();

	useEffect(() => {
		if (creator?.id == loggedInUser?.id) {
			setIsTheSameUser(true);
		}
	}, [loggedInUser?.id]);

	const { data: creator, isLoading } = useQuery({
		queryKey: queryKeys.user.getByName(creatorname),
		queryFn: () => getCreatorByName(creatorname),
		enabled: !!creatorname,
	});

	if (isLoading || !creator) {
		return null;
	}

	const getTagLabel = (tagValue: string) => {
		const tagOption = ProfileTagsOptions.find((option) => option.value === tagValue);
		return tagOption ? tagOption.label : tagValue; // Return the tag value if no match is found
	};

	return (
		<div className="transition-all duration-300 p-5 md:p-7 lg:p-8 w-screen md:w-[32rem] lg:w-[33rem] rounded-none md:rounded-2xl bg-white flex flex-col gap-3 items-start h-fit ">
			<div className="space-y-1.5">
				<p className="text-sm md:text-lg font-bold -tracking-wide">About {/*creator.userName*/}</p>
				<p className="text-xs md:text-sm font-normal text-zinc-500">{creator.bio}</p>
			</div>
			<div className="flex items-center gap-3">
				{creator?.socialMediaLink.map((link) => (
					<SocialMediaIcon key={link.url} link={link} iconClassName="text-2xl text-gray-400" />
				))}
				{isTheSameUser ? (
					<Button
						onClick={() => onOpen('socialMediaLinksModal')}
						variant={'secondary'}
						className="p-0.5 px-3"
					>
						<FiEdit />
					</Button>
				) : null}
			</div>
			<div className="flex items-center justify-start flex-wrap content-start gap-1">
				{creator.tags.map((tag) => {
					const encodedTag = encodeURIComponent(tag);
					const tagLabel = getTagLabel(tag);

					return (
						<a key={tag} href={`/explore?category=${encodedTag}`} target="_blank">
							<div className="text-xs font-semibold p-1.5 text-gray-500 bg-gray-100 rounded-sm">
								{tagLabel}
							</div>
						</a>
					);
				})}{' '}
			</div>
		</div>
	);
};
