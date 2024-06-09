'use client';
import { getCreatorPosts } from '@/actions/posts';
import PostImageComponent from '@/components/Posts/Post';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/authentication';
import { useInterface } from '@/store/InterfaceStore';
import { Post } from '@prisma/client';
import { User } from 'lucia';
import React, { useEffect, useState } from 'react';
import GallerySection from '@/components/Posts/GallerySection';
import { useQuery } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import { toast } from 'sonner';
import { LoadingOutlined } from '@ant-design/icons';

export default function Page() {
	const { onOpen } = useInterface();
	const [latestPost, setLatestPost] = useState<Post[] | null>(null);

	const { data: creator } = useQuery({
		queryKey: queryKeys.user.current(),
		queryFn: () => getCurrentUser(),
	});

	const {
		data: posts,
		fetchStatus,
		status,
	} = useQuery({
		queryKey: queryKeys.post.many(),
		queryFn: () => getCreatorPosts(creator?.id!, 0),
		enabled: !!creator,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (fetchStatus === 'idle' && status === 'success') {
			setLatestPost(posts);
		}
		if (fetchStatus === 'idle' && status === 'error') toast.error('An error occurred while fetching posts');
	}, [fetchStatus, status]);

	if (fetchStatus === 'fetching')
		return (
			<div className=" flex items-center justify-center w-full h-full">
				<LoadingOutlined />
			</div>
		);

	if (!creator) {
		return null;
	}

	return (
		<div className="w-11/12 lg:3/4 xl:w-2/3 mx-auto m-3 lg:my-8">
			<section className="w-full flex items-center justify-end mb-2 md:mb-3 lg:mb-5 px-2">
				<Button
					onClick={() => onOpen('makeImagePostModal')}
					className="-tracking-wide text-xs md:text-sm font-bold bg-purple-800"
				>
					Make New Post
				</Button>
			</section>
			<GallerySection posts={latestPost} isImageOnly={false} />
		</div>
	);
}
