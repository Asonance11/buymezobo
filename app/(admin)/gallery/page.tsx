'use client';
import { getCreatorPosts } from '@/actions/posts';
import PostImageComponent from '@/components/common/Post';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/authentication';
import { useInterface } from '@/store/InterfaceStore';
import { Post } from '@prisma/client';
import { User } from 'lucia';
import React, { useEffect, useState } from 'react';

export default function Page() {
	const { onOpen } = useInterface();
	const [creator, setCreator] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [latestPost, setLatestPost] = useState<Post[] | null>(null);

	useEffect(() => {
		const getPost = async () => {
			setLoading(true);
			const post = await getCreatorPosts(creator?.id!);
			setLatestPost(post);
			setLoading(false);
		};
		if (creator) {
			getPost();
		}
	}, [creator?.id, creator]);

	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			const creator = await getCurrentUser();
			setCreator(creator);
			setLoading(false);
		};
		getUser();
	}, []);

	if (!creator) {
		return null;
	}

	return (
		<div className="w-11/12 lg:3/4 xl:w-2/3 mx-auto m-3 lg:my-8">
			<section className="w-full flex items-center justify-end">
				<Button onClick={() => onOpen('makeImagePostModal')} className="-tracking-wide font-bold bg-purple-800">
					Make New Post
				</Button>
			</section>
			<section
				className={`transition-all grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 p-2 lg:p-3 items-start content-evenly`}
			>
				{latestPost?.map((post) => <PostImageComponent imageOnly={false} post={post} key={post.id} />)}
			</section>
		</div>
	);
}
