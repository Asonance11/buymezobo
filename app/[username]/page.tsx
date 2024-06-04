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
import { User } from 'lucia';
import { AboutCard } from './_components/AboutCard';
import { ImagePostCard } from './_components/ImagePostCard';

export default function Username(props: any) {
	const creatorname = props.params.username;
	const [latestPost, setLatestPost] = useState<Post | null>(null);
	const [reloadSupporters, setReloadSupporters] = useState(false);

	const { data: creator } = useQuery({
		queryKey: queryKeys.user.getByName(creatorname),
		queryFn: () => getCreatorByName(creatorname),
		enabled: !!creatorname,
        refetchOnWindowFocus: false,
	});

	const {
		data: posts,
		status,
		fetchStatus,
	} = useQuery({
		queryKey: [...queryKeys.post.many()],
		queryFn: () => getCreatorPosts(creator?.id!, 1),
		enabled: !!creator,
        refetchOnWindowFocus: false,
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
					<UserNameHeader className="" user={creator as User} />
					<section className="flex-1 bg-blue-700 w-full flex flex-col ">
						<div
							className="w-full h-72 bg-gray-300 bg-center bg-cover bg-no-repeat"
							style={{ backgroundImage: `url(${creator?.headerImageUrl})` }}
						></div>
						<div className="flex-1 flex flex-col-reverse lg:flex-row justify-center md:gap-3 relative items-center py-5 lg:py-3 lg:items-start bg-purple-100">
							<section className="flex-col flex gap-3 lg:-mt-32">
								<AboutCard creatorname={creatorname} />
								<SupportersCard
									post={latestPost ? latestPost : null}
									creator={creator as User}
									reload={reloadSupporters}
								/>
							</section>
							<section className="-mt-28 lg:-mt-32 flex-col flex gap-3 ">
								<BuyCard
									creator={creator as User}
									setReload={() => setReloadSupporters(!reloadSupporters)}
								/>
								<ImagePostCard creatorname={creatorname} />
							</section>
						</div>
					</section>
				</>
			)}
		</main>
	);
}
