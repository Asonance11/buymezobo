'use client';
import UserNameHeader from '@/components/common/UsernameHeader';
import { getCreatorByName } from '@/lib/creator';
import { Post, Profile } from '@prisma/client';
import { useEffect, useState } from 'react';
import BuyCard from './_components/BuyCard';
import SupportersCard from './_components/SupportersCard';
import Loading from './loading';
import { User } from 'lucia';
import { getCreatorPosts } from '@/actions/posts';

export default function Username(props: any) {
	const creatorname = props.params.username;
	const [creator, setCreator] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [reloadSupporters, setReloadSupporters] = useState(false);
	const [latestPost, setLatestPost] = useState<Post | null>(null);

	useEffect(() => {
		const getPost = async () => {
			const post = await getCreatorPosts(creator?.id!, 1);
			setLatestPost(post[0]);
			setLoading(false);
		};
		if (creator) {
			getPost();
		}
	}, [creator?.id, creator]);

	useEffect(() => {
		const getUser = async () => {
			const creator = await getCreatorByName(creatorname);
			setCreator(creator);
			setLoading(false);
		};
		getUser();
	}, [creatorname]);

	if (!creator) {
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
							<SupportersCard
								post={latestPost ? latestPost : null}
								className="lg:-mt-32"
								creator={creator}
								reload={reloadSupporters}
							/>
							<BuyCard
								className="-mt-28 lg:-mt-32"
								creator={creator}
								setReload={() => setReloadSupporters(!reloadSupporters)}
							/>
						</div>
					</section>
				</>
			)}
		</main>
	);
}
