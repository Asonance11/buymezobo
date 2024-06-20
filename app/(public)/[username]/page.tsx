'use client';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { getCreatorByName } from '@/lib/creator';
import { Post } from '@prisma/client';
import { useEffect, useState } from 'react';
import BuyCard from './_components/BuyCard';
import SupportersCard from './_components/SupportersCard';
import Loading from '../loading';
import { getCreatorPosts } from '@/actions/posts';
import { useQuery } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import { toast } from 'sonner';
import { User } from 'lucia';
import { AboutCard } from './_components/AboutCard';
import { ImagePostCard } from './_components/ImagePostCard';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';

export default function Username(props: any) {
	const creatorname = props.params.username;
	const [latestPost, setLatestPost] = useState<Post | null>(null);
	const [reloadSupporters, setReloadSupporters] = useState(false);

	const [tabIndex, setTabIndex] = useState(0);

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
	if (fetchStatus === 'fetching') return null;

	return (
		<main className="min-h-screen bg-white flex flex-col ">
			<UserNameHeader className="" user={creator as User} />
			<section className="flex-1 bg-blue-700 w-full flex flex-col ">
				<div
					className="w-full h-32 lg:h-36 xl:h-56 bg-gray-300 bg-center bg-cover bg-no-repeat border-2 border-red-800 relative"
					style={{ backgroundImage: `url(${creator?.headerImageUrl})` }}
				>
					<div className="w-[95%] md:w-[70%]  xl:w-3/5 mx-auto absolute inset-x-0 bottom-0 transform translate-y-1/2 flex items-end justify-between bg-pink-300 lg:p-3">
						<div
							className="cursor-pointer rounded-full w-28 md:w-36 xl:w-40 h-28 md:h-36 xl:h-40 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
							style={{ backgroundImage: `url(${creator!.imageUrl})` }}
						></div>
						<Button>Edit Page</Button>
					</div>
				</div>
				<div className="w-[95%] md:w-[70%] xl:w-3/5 bg-red-400 p-2 /5 mx-auto mt-14 md:mt-20  xl:mt-24">
					<div>
						<div>
							<p>
								fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
							</p>
						</div>
						<div>
							<p>
								fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
							</p>
							<p>
								fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
							</p>
							<p>
								fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
							</p>
						</div>
					</div>
					<section className='p-10 bg-sky-900'></section>
				</div>
			</section>
		</main>
	);
}

/*
    <div className="flex-1 flex flex-col-reverse lg:flex-row justify-center md:gap-3 items-center py-5 lg:py-3 lg:items-start bg-purple-500 "></div>
    <section className="flex-col flex gap-3 lg:-mt-32">
                                <AboutCard creatorname={creatorname} />
                                <SupportersCard
                                    post={latestPost ? latestPost : null}
                                    creator={creator as User}
                                    reload={reloadSupporters}
                                />
                            </section>
                            <section className="-mt-28 lg:-mt-32 flex-col flex gap-3 lg:sticky top-2">
                                <BuyCard
                                    className=""
                                    creator={creator as User}
                                    setReload={() => setReloadSupporters(!reloadSupporters)}
                                />
                                <ImagePostCard creatorname={creatorname} />
                            </section>

    */
