'use client';
import React, { useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { PostPrimitive } from '@/types/primitives';
import { useInfiniteQuery } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import { Box } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import PostImageComponent from '@/components/Posts/Post';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { LoadingOutlined } from '@ant-design/icons';

interface GalleryTabProps {
	tabIndex: number;
	creatorname: string;
}

const MAX_ARTICLES_PAGE = 15;

export function GalleryTab({ tabIndex, creatorname }: GalleryTabProps) {
	const observer = useRef<IntersectionObserver | null>(null);

	const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
		console.log(`Fetching posts for page: ${pageParam}`);
		const response = await axios.get(`/api/posts/user/${creatorname}?page=${pageParam}&limit=${MAX_ARTICLES_PAGE}`);
		console.log(`Fetched posts: `, response.data.posts);
		return response.data.posts as PostPrimitive[] | [];
	};
	return null;

	const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
		queryKey: [queryKeys.post.all, creatorname],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === MAX_ARTICLES_PAGE ? allPages.length + 1 : undefined;
		},
		enabled: !!creatorname,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
	}); //works

	const lastElementRef = useCallback(
		(node: HTMLDivElement) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetching) {
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[fetchNextPage, hasNextPage, isFetching, isLoading],
	);

	const posts = useMemo(() => {
		return data?.pages.flat();
	}, [data]);

	return (
		<main className="min-h-screen flex flex-col ">
			<>
				<div className="flex-1 flex flex-col-reverse lg:flex-row justify-center gap-3 relative items-center py-5 lg:py-3 lg:items-start bg-gray-100 ">
					<div className=" w-10/11 md:w-3/4 lg:w-3/5 p-3 space-y-3 mx-auto bg-white lg:rounded-lg ">
						<p className="text-lg font-semibold -tracking-wide">Gallery</p>
						<Box>
							<Masonry columns={{ xs: 2, md: 3, lg: 4 }} spacing={{ xs: 1, md: 2, lg: 2 }}>
								<PhotoProvider maskOpacity={0.9}>
									{posts?.map((post, index) => {
										const refProp = index === posts.length - 1 ? { ref: lastElementRef } : {};

										return (
											<PhotoView key={post.id} src={post.imageUrl}>
												<PostImageComponent
													{...refProp}
													imageOnly={false}
													post={post}
													key={post.id}
												/>
											</PhotoView>
										);
									})}
								</PhotoProvider>
							</Masonry>
							{isFetching && (
								<div className="w-full flex items-center justify-center p-3">
									<LoadingOutlined />
								</div>
							)}
						</Box>
					</div>
				</div>
			</>
		</main>
	);
}
