'use client';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { getCreatorByName } from '@/lib/creator';
import { Post, Profile } from '@prisma/client';
import { ReactNode, useEffect, useState } from 'react';
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
import { cn } from '@/utility/style';
import { ProfilePrimitive } from '@/types/primitives';

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

	const Container = ({ children, className }: { children: ReactNode; className?: string }) => {
		return (
			<CustomContainer className={cn('w-[97%] md:w-[70%] xl:w-3/5 mx-auto p-0', className)}>
				{children}
			</CustomContainer>
		);
	};

	return (
		<main className="min-h-screen bg-white flex flex-col ">
			<UserNameHeader className="" user={creator as User} />
			<section className="flex-1  w-full flex flex-col ">
				<div
					className="w-full h-32 lg:h-36 xl:h-48 bg-gray-300 bg-center bg-cover bg-no-repeat relative"
					style={{ backgroundImage: `url(${creator?.headerImageUrl})` }}
				>
					<div className="w-[97%] md:w-[70%]  xl:w-3/5 mx-auto absolute inset-x-0 bottom-0 transform translate-y-1/2 flex flex-col gap-1 md:gap-2 md:flex-row md:items-end md:justify-between lg:p-1 ">
						<div
							className="cursor-pointer rounded-full w-24 md:w-36 xl:w-36 h-24 md:h-36 xl:h-36 bg-center bg-cover bg-no-repeat border-1 border-purple-300 "
							style={{ backgroundImage: `url(${creator!.imageUrl})` }}
						></div>
						<div className="flex-1 p-3 items-center gap-1.5 justify-end hidden lg:flex ">
							<Button className="text-xs lg:text-sm py-1 px-2.5 rounded-lg hidden" variant={'outline'}>
								{' '}
								FUCK
							</Button>

							<Button className="text-xs lg:text-sm py-1 px-2.5 rounded-lg hidden" variant={'outline'}>
								{' '}
								Edit Profilerr
							</Button>

							<Button className="text-xs lg:text-sm py-1 px-2.5 rounded-lg" variant={'outline'}>
								{' '}
								Edit Profilerr
							</Button>
						</div>
					</div>
				</div>
				<div className="mt-12 md:mt-20 xl:mt-[4.8rem] py-1.5 ">
					<Container className="space-y-1">
						<p className="font-bold text-base tracking-tight">{creator.userName}</p>
						<p className="font-light text-sm text-gray-600 tracking-tight ">
							{creator.firstName || '' + ' ' + creator.lastName || ''}
						</p>
						<div className="flex items-center justify-start gap-3">
							<p className="font-light text-xs lg:text-sm tracking-tight">
								<span className="font-semibold text-black">{creator.following?.length}</span> following
							</p>
							<p className="font-light text-xs lg:text-sm tracking-tight">
								<span className="font-semibold text-black">{creator.followers?.length}</span> followers
							</p>
						</div>
					</Container>
				</div>
				<Tabs size={'sm'} defaultIndex={tabIndex}>
					<div className="">
						<Container>
							<TabList>
								<Tab>About</Tab>
								<Tab>Gallery</Tab>
								<Tab>Articles</Tab>
							</TabList>
						</Container>
					</div>
					<div className="bg-purple-200 h-full">
						<Container>
							<TabPanels>
								<TabPanel>
									<AboutTab creatorname={creatorname} creator={creator} tabIndex={tabIndex} />
								</TabPanel>
								<TabPanel>
									<p>two!</p>
								</TabPanel>
								<TabPanel>
									<p>three!</p>
								</TabPanel>
							</TabPanels>
						</Container>
					</div>
				</Tabs>
			</section>
		</main>
	);
}
