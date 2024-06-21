'use client';
import GallerySection from '@/components/Posts/GallerySection';
import { Post } from '@prisma/client';
import { User } from 'lucia';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Loading from '../../loading';
import axios from 'axios';
import { PostPrimitive } from '@/types/primitives';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';

interface GalleryTabProps {
	tabIndex: number;
	creatorname: string;
}

const MAX_ARTICLES_PAGE = 15;

export function GalleryTab({ tabIndex, creatorname }: GalleryTabProps) {
    return null
	const observer = useRef<IntersectionObserver | null>(null);

	const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
		const response = await axios.get(
			`/api/posts/user/${creatorname}?page=${pageParam}&limit=${MAX_ARTICLES_PAGE}}`,
		);
		console.log(response);
		return response.data.posts as PostPrimitive[] | [];
	};

	const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
		queryKey: [queryKeys.post.all],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === MAX_ARTICLES_PAGE ? allPages.length + 1 : undefined;
		},
		//enabled: !!creator,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
	});

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
					<div className=" w-10/11 md:w-3/4 lg:w-3/5 p-3 space-y-3 -mt-36  lg:-mt-32 mx-auto bg-white lg:rounded-lg ">
						<p className="text-lg font-semibold -tracking-wide">Gallery</p>
						<GallerySection
							className=""
							isFetching={isFetching}
							lastElementRef={lastElementRef}
							posts={posts as Post[]}
						/>
					</div>
				</div>
			</>
		</main>
	);
}
