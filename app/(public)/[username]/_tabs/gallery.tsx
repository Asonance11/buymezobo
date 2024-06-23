'use client';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import PostImageComponent from '@/components/Posts/Post';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Loader from '@/components/common/Loader';
import { PostPrimitive } from '@/types/primitives';

interface GalleryTabProps {
	creatorName: string;
	tabValue?: string;
}

const MAX_ARTICLES_PAGE = 12; // Increased for better grid layout

export function GalleryTab({ creatorName, tabValue }: GalleryTabProps) {
	const observer = useRef<IntersectionObserver | null>(null);
	const [imagesLoaded, setImagesLoaded] = useState(0);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);

	const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
		console.log(`Fetching posts for page: ${pageParam}`);
		console.log('Creator name is: ' + creatorName);
		const response = await axios.get(`/api/posts/user/${creatorName}?page=${pageParam}&limit=${MAX_ARTICLES_PAGE}`);
		const posts = response.data.posts || [];
		console.log(`Fetched posts: `, posts);
		return posts as PostPrimitive[] | [];
	};

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
		queryKey: ['images', creatorName],
		queryFn: fetchPosts,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length === MAX_ARTICLES_PAGE ? allPages.length + 1 : undefined,
		initialPageParam: 1,
		enabled: tabValue === 'gallery',
		refetchOnWindowFocus: false,
	});

	const lastElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading || !initialLoadComplete || isFetchingNextPage) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[fetchNextPage, hasNextPage, isLoading, initialLoadComplete, isFetchingNextPage],
	);

	const posts = useMemo(() => data?.pages.flat() || [], [data]);

	useEffect(() => {
		if (posts.length > 0 && imagesLoaded === posts.length) {
			setInitialLoadComplete(true);
		}
	}, [posts, imagesLoaded]);

	const handleImageLoad = () => setImagesLoaded((prev) => prev + 1);

	console.log(data?.pages);
	console.log(posts);

	if (isLoading) return <Loader className="m-auto" />;
	if (isError) return <p className="text-center text-red-500">Error loading images</p>;
	if (posts.length === 0) return <p className="text-center">No images found</p>;

	return (
		<main className="p-4">
			<PhotoProvider maskOpacity={0.8}>
				<ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 2, 900: 3 }}>
					<Masonry gutter="10px">
						{posts.map((post, index) => (
							<PhotoView key={post.id} src={post.imageUrl}>
								<div className="overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105">
									<PostImageComponent
										ref={index === posts.length - 1 ? lastElementRef : undefined}
										imageOnly={true}
										post={post}
										onImageLoad={handleImageLoad}
										className="w-full h-auto"
									/>
								</div>
							</PhotoView>
						))}
					</Masonry>
				</ResponsiveMasonry>
			</PhotoProvider>
			{isFetchingNextPage && (
				<div className="flex justify-center mt-4">
					<Loader />
				</div>
			)}
		</main>
	);
}
