'use client';
import { getCreatorPosts } from '@/actions/posts';
import GallerySection from '@/components/Posts/GallerySection';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { getCreatorByName } from '@/lib/creator';
import { Post } from '@prisma/client';
import { User } from 'lucia';
import React, { useEffect, useState } from 'react';
import Loading from '../loading';

export default function Page(props: any) {
	const creatorname = props.params.username;
	const [creator, setCreator] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [latestPost, setLatestPost] = useState<Post[] | null>(null);

	useEffect(() => {
		const getPost = async () => {
			const post = await getCreatorPosts(creator?.id!, 0); //0 means take all
			setLatestPost(post);
			setLoading(false);
		};
		if (creator) {
			getPost();
		}
	}, [creator?.id, creator]);

	useEffect(() => {
		const getUser = async () => {
			const creator = await getCreatorByName(creatorname);
			setCreator(creator as User | null);
			setLoading(false);
		};
		getUser();
	}, [creatorname]);

	if (!creator || loading || !latestPost || latestPost?.length < 1) {
		return null;
	}

	return (
		<main className="min-h-screen bg-red-700 flex flex-col ">
			{loading ? (
				<Loading />
			) : (
				<>
					<UserNameHeader className="" user={creator} />
					<section className="flex-1 bg-blue-700 w-full flex flex-col ">
						<div
							className="w-full h-72 bg-gray-300 bg-center bg-cover bg-no-repeat"
							style={{ backgroundImage: `url(${creator?.headerImageUrl})` }}
						></div>
						<div className="flex-1 flex flex-col-reverse lg:flex-row justify-center gap-3 relative items-center py-5 lg:py-3 lg:items-start bg-gray-300">
							<div className=" w-10/11 md:w-3/4 lg:w-3/5 p-3 space-y-3 -mt-28  lg:-mt-32 mx-auto bg-white lg:rounded-lg ">
								<p className="text-lg font-semibold -tracking-wide">Gallery</p>
								<GallerySection className="" posts={latestPost} />
							</div>
						</div>
					</section>
				</>
			)}
		</main>
	);
}
