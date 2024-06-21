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
import PostImageComponent from '@/components/Posts/Post';
import Link from 'next/link';
import { PostPrimitive } from '@/types/primitives';
import axios from 'axios';

interface Props {
	creatorname: string;
}

export const ImagePostCard = ({ creatorname }: Props) => {
	const { onOpen } = useInterface();
	const { loggedInUser } = useUser();

	const MAX_ARTICLES_PAGE = 1;

	const fetchPosts = async () => {
		const response = await axios.get(`/api/posts/user/${creatorname}?&limit=${MAX_ARTICLES_PAGE}`);
		const posts = response.data.posts || [];
		console.log(`Fetched posts: `, posts);
		return posts as PostPrimitive[] | [];
	};

	const { data: posts, isLoading } = useQuery({
		queryKey: queryKeys.user.getByName(creatorname),
		queryFn: () => fetchPosts(),
		//queryFn: () => getCreatorByName(creatorname),
		enabled: !!creatorname,
		refetchOnWindowFocus: false,
	});

	if (isLoading || !posts || posts?.length == 0) {
		return null;
	}

	return (
		<div className="transition-all duration-300 p-5 md:p-7 lg:p-8 w-screen md:w-[32rem] lg:w-[33rem] rounded-none md:rounded-2xl bg-white flex flex-col gap-3 items-start h-fit ">
			{posts.length > 0 ? (
				<>
					{' '}
					<p className="tracking-tight font-semibold text-gray-900">Gallery</p>
					<PostImageComponent post={posts[0]} />{' '}
				</>
			) : null}
			{posts.length > 0 ? (
				<Link className="w-full" href={`/${creatorname}?tab=gallery`}>
					<Button className="w-full" variant={'ghost'}>
						See more photos
					</Button>
				</Link>
			) : (
				<div></div>
			)}
		</div>
	);
};
