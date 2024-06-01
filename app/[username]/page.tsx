'use client';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { getCreatorByName } from '@/lib/creator';
import { Post } from '@prisma/client';
import { useEffect, useState } from 'react';
import BuyCard from './_components/BuyCard';
import SupportersCard from './_components/SupportersCard';
import Loading from './loading';
import { getCreatorPosts } from '@/actions/posts';
import { useQuery } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import { toast } from 'sonner';

export default function Username(props: any) {
	const creatorname = props.params.username;
	const [latestPost, setLatestPost] = useState<Post | null>(null);
	const [reloadSupporters, setReloadSupporters] = useState(false);

	const { data: creator } = useQuery({
		queryKey: queryKeys.user.getByName(creatorname),
		queryFn: () => getCreatorByName(creatorname),
		enabled: !!creatorname,
	});

	const {
		data: posts,
		status,
		fetchStatus,
	} = useQuery({
		queryKey: [...queryKeys.post.many()],
		queryFn: () => getCreatorPosts(creator?.id!, 1),
		enabled: !!creator,
	});

	useEffect(() => {
		if (fetchStatus === 'idle' && status === 'success') setLatestPost(posts[0]);
		if (fetchStatus === 'idle' && status === 'error') toast.error('An error occurred');
	}, [fetchStatus, status]);

	if (!creator) {
		return null;
	}

	return (
		<main className="min-h-screen bg-white flex flex-col ">
			{fetchStatus === 'fetching' ? (
				<Loading />
			) : (
				<>
					<UserNameHeader className="" user={creator} />
					<section className="flex-1 bg-blue-700 w-full flex flex-col ">
						<div
							className="w-full h-72 bg-gray-300 bg-center bg-cover bg-no-repeat"
							style={{ backgroundImage: `url(${creator?.headerImageUrl})` }}
						></div>
						<div className="flex-1 flex flex-col-reverse lg:flex-row justify-center md:gap-3 relative items-center py-5 lg:py-3 lg:items-start bg-gray-300">
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
