'use client';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { getCreatorByName } from '@/lib/creator';
import { Post } from '@prisma/client';
import { useEffect, useState } from 'react';
import { getCreatorPosts } from '@/actions/posts';
import { useQuery } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import { toast } from 'sonner';
import { User } from 'lucia';
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/store/UserDataStore';
import AboutTab from './_tabs/About';
import { CustomContainer } from '@/components/custom/container';

export default function Username(props: any) {
	const creatorname = props.params.username;
	const [latestPost, setLatestPost] = useState<Post | null>(null);

	const [tabIndex, setTabIndex] = useState(0);

	const { loggedInUser } = useUser();

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
			<section className="flex-1  w-full flex flex-col ">
				<div
					className="w-full h-32 lg:h-36 xl:h-52 bg-gray-300 bg-center bg-cover bg-no-repeat relative"
					style={{ backgroundImage: `url(${creator?.headerImageUrl})` }}
				>
					<div className="w-[97%] md:w-[70%]  xl:w-3/5 mx-auto absolute inset-x-0 bottom-0 transform translate-y-1/2 flex flex-col gap-1 md:gap-2 md:flex-row md:items-end md:justify-between lg:p-1">
						<div
							className="cursor-pointer rounded-full w-24 md:w-36 xl:w-40 h-24 md:h-36 xl:h-40 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
							style={{ backgroundImage: `url(${creator!.imageUrl})` }}
						></div>
						<div className="flex-1 p-3 items-center gap-1.5 justify-end hidden lg:flex ">
							<Button className=" text-xs lg:text-sm py-1 px-2.5 rounded-lg" variant={'outline'}>
								{' '}
								Edit Profile
							</Button>
						</div>
					</div>
				</div>
				<div className="w-full bg-purple-100">
					<div className="w-[97%] md:w-[70%] xl:w-3/5 p-1 /5 mx-auto mt-12 md:mt-20  xl:mt-[5.6rem] md:rounded-lg">
						<div>
							<p className="font-extrabold tracking-tight text-sm lg:text-lg ">{creator.userName}</p>
							<p className="font-light text-xs lg:text-sm text-gray-700">
								{creator.firstName || '' + ' ' + creator.lastName || ''}
							</p>
						</div>
						<Tabs position="relative" variant="unstyled">
							<TabList>
								<div className="w-full sticky top-0">
									<Tab className="text-xs lg:text-sm" fontSize={'small'}>
										About
									</Tab>
								</div>
							</TabList>
							<TabIndicator mt="-1.5px" height="2px" bg="purple.500" borderRadius="1px" />

							<TabPanels>
								<TabPanel bg="" padding={'o'}>
									<AboutTab creator={creator} creatorname={creatorname} tabIndex={tabIndex} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</div>
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
