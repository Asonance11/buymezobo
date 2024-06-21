'use client';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { CiCamera } from 'react-icons/ci';
import { getCreatorByName } from '@/lib/creator';
import { Post } from '@prisma/client';
import { ReactNode, useEffect, useState } from 'react';
import { getCreatorPosts } from '@/actions/posts';
import { useQuery } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import { toast } from 'sonner';
import { User } from 'lucia';
import { Button } from '@/components/ui/button';
import { useUser } from '@/store/UserDataStore';
import AboutTab from './_tabs/About';
import { CustomContainer } from '@/components/custom/container';
import { cn } from '@/utility/style';
import { FaEdit } from 'react-icons/fa'; // Importing icons from react-icons
import { useInterface } from '@/store/InterfaceStore';
import { GalleryTab } from './_tabs/gallery';
import { Tabs, rem } from '@mantine/core';
import { FaInfoCircle, FaImages, FaFileAlt } from 'react-icons/fa';
import ArticlesTab from './_tabs/Articles';
import { FollowButton } from './_components/FollowButton';
import { avatarImageUrl } from '@/utility/avatar';
import { FaCog, FaEllipsisH } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOrigin } from '@/hooks/useOrigin';
import { SlOptionsVertical } from 'react-icons/sl';

export type TabOptions = 'about' | 'gallery' | 'articles';

export default function Username(props: any) {
	const creatorname = props.params.username;
	const [latestPost, setLatestPost] = useState<Post | null>(null);
	const [tabIndex, setTabIndex] = useState(0);
	const origin = useOrigin();
	const router = useRouter();
	const searchParams = useSearchParams();
	const tab = searchParams.get('tab') || 'about';
	const [activeTab, setActiveTab] = useState<string | null>(tab);

	const { onOpen } = useInterface();
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

	const handleTabChange = (tab: string | null) => {
		setActiveTab(tab);
		router.push(`/${creatorname}?tab=${tab}`, {});
	};

	const openEditPage = () => {
		onOpen('editUsernamePage', { creator: loggedInUser });
	};

	if (fetchStatus === 'fetching') return null;

	const Container = ({ children, className }: { children: ReactNode; className?: string }) => {
		return (
			<CustomContainer className={cn('w-[97%] md:w-[70%] xl:w-3/5 mx-auto', className)}>
				{children}
			</CustomContainer>
		);
	};
	const iconStyle = { width: rem(12), height: rem(12) };

	return (
		<main className="min-h-screen bg-white flex flex-col ">
			<UserNameHeader className="" user={creator as User} />
			<section className="flex-1  w-full flex flex-col ">
				<div
					className="w-full h-32 lg:h-36 xl:h-48 bg-white bg-center bg-cover bg-no-repeat relative"
					style={{ backgroundImage: `url(${creator?.headerImageUrl})` }}
				>
					<CustomContainer className="absolute top-2 right-1 flex flex-row gap-2 ">
						<Button
							className="bg-white/60 hover:bg-white text-gray-700 p-1 text-xs lg:text-base lg:p-2 rounded-full hidden lg:block"
							onClick={() => onOpen('editHeaderImageMModal')}
						>
							<CiCamera size={20} />
						</Button>
						<Button className="bg-white/60 hover:bg-white text-gray-700 p-2 rounded-full hidden lg:block">
							<FaCog size={20} />
						</Button>
						<Button className="bg-transparent lg:bg-white/60 hover:bg-white text-gray-700 p-2 rounded-full">
							<SlOptionsVertical size={20} />
						</Button>
					</CustomContainer>{' '}
					<CustomContainer className="w-[97%] md:w-[70%] xl:w-3/5 mx-auto absolute inset-x-0 bottom-0 transform translate-y-1/2 flex flex-col gap-1 md:gap-2 md:flex-row md:items-end md:justify-between lg:p-1 ">
						<div className="relative cursor-pointer rounded-full w-24 md:w-36 xl:w-36 h-24 md:h-36 xl:h-36 border-1 border-purple-300 overflow-hidden group">
							<div
								className="bg-center bg-cover bg-no-repeat w-full h-full"
								style={{ backgroundImage: `url(${avatarImageUrl(creator)})` }}
							></div>
							{loggedInUser?.id == creator.id && (
								<div
									className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
									onClick={() => onOpen('editProfileImageMModal')}
								>
									<FaEdit
										className="text-white text-2xl"
										onClick={() => onOpen('editProfileImageMModal')}
									/>
								</div>
							)}
						</div>{' '}
						<div className="flex-1 p-3 items-center gap-1.5 justify-end hidden lg:flex ">
							{loggedInUser?.id === creator.id ? (
								<Button
									className="text-xs lg:text-sm py-1 px-2.5 flex items-center rounded-lg"
									variant={'outline'}
									onClick={openEditPage}
								>
									{' '}
									<FaEdit className="mr-1" /> Edit Page
								</Button>
							) : (
								/*
                                {
                                    <Button
                                        className="text-xs lg:text-sm py-1 px-2.5 rounded-lg hidden"
                                        variant={'outline'}
                                    >
                                        Follow
                                    </Button>
                                }
                                    */
								<FollowButton />
							)}
						</div>
					</CustomContainer>
				</div>
				<div className="mt-12 md:mt-20 xl:mt-[4.8rem] py-1.5 ">
					<Container className="space-y-1">
						<p className="font-bold text-base tracking-tight">{creator.userName}</p>
						<p className="font-light text-sm text-gray-600 tracking-tight ">
							buymezobo.ng/{creator.userName}
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
				<Tabs color="grape" value={activeTab} onChange={handleTabChange}>
					<Tabs.List className="w-[97%] md:w-[70%] xl:w-3/5 mx-auto ">
						<Tabs.Tab value="about" leftSection={<FaInfoCircle style={iconStyle} />}>
							About
						</Tabs.Tab>
						<Tabs.Tab value="gallery" leftSection={<FaImages style={iconStyle} />}>
							Gallery
						</Tabs.Tab>
						<Tabs.Tab value="articles" leftSection={<FaFileAlt style={iconStyle} />}>
							Articles
						</Tabs.Tab>
					</Tabs.List>
					<div className="bg-purple-100 h-full pt-5">
						<CustomContainer className="p-0 w-[97%] md:w-[70%] xl:w-3/5 mx-auto">
							{/*
							 */}
							<Tabs.Panel value="about">
								<AboutTab creatorname={creatorname} creator={creator} tabIndex={tabIndex} />
							</Tabs.Panel>
							<Tabs.Panel value="gallery">
								<GalleryTab tabValue={activeTab || ''} creatorname={creatorname} tabIndex={tabIndex} />
							</Tabs.Panel>
							<Tabs.Panel value="articles">
								<ArticlesTab creatorname={creatorname} tabValue={activeTab || ''} />
							</Tabs.Panel>
						</CustomContainer>
					</div>
				</Tabs>
			</section>
		</main>
	);
}
