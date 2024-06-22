'use client';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { PostPrimitive } from '@/types/primitives';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Box } from '@mui/material';
import PostImageComponent from '@/components/Posts/Post';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { LoadingOutlined } from '@ant-design/icons';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

interface GalleryTabProps {
	tabIndex: number;
	creatorname: string;
	tabValue?: string;
}

const MAX_ARTICLES_PAGE = 10;

export function GalleryTab({ tabIndex, creatorname, tabValue }: GalleryTabProps) {
	const observer = useRef<IntersectionObserver | null>(null);

	const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
		const response = await axios.get(`/api/posts/user/${creatorname}?page=${pageParam}&limit=${MAX_ARTICLES_PAGE}`);
		const posts = response.data.posts || [];
		return posts as PostPrimitive[] | [];
	};

	const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
		queryKey: ['images', creatorname],
		queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === 0 ? undefined : allPages.length + 1;
		},
		initialPageParam: 1,
		enabled: tabValue === 'gallery',
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
	});

	const lastElementRef = useCallback(
		(node: HTMLDivElement) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetching) {
					console.log('Fetching next page...');
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[fetchNextPage, hasNextPage, isFetching, isLoading],
	);

	const posts = useMemo(() => {
		if (!data || !data.pages) return [];
		return data.pages.flat();
	}, [data]);

	return (
		<main className="flex flex-col min-h-96">
			<div className="flex-1 flex flex-col-reverse bg-gray-100 ">
				{posts && posts.length > 0 && (
					<PhotoProvider maskOpacity={0.9}>
						<ResponsiveMasonry columnsCountBreakPoints={{ 300: 2, 500: 3, 700: 3 }}>
							<Masonry gutter="1rem">
								{posts.map((post, index) => {
									const refProp = index === posts.length - 1 ? { ref: lastElementRef } : {};
									return (
										<PhotoView key={post.id} src={post.imageUrl}>
											<PostImageComponent {...refProp} imageOnly={true} post={post} />
										</PhotoView>
									);
								})}
							</Masonry>
						</ResponsiveMasonry>
					</PhotoProvider>
				)}
			</div>
		</main>
	);
}
