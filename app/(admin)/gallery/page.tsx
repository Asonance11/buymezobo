'use client';
import PostImageComponent from '@/components/Posts/Post';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/authentication';
import { useInterface } from '@/store/InterfaceStore';
import { Post } from '@prisma/client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import { Separator } from '@/components/ui/separator';
import { PostPrimitive } from '@/types/primitives';
import axios from 'axios';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const MAX_ARTICLES_PAGE = 10;

export default function Page() {
    const { onOpen } = useInterface();
    const observer = useRef<IntersectionObserver | null>(null);

    const { data: creator } = useQuery({
        queryKey: queryKeys.user.current(),
        queryFn: () => getCurrentUser(),
    });

    const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
        console.log(`Fetching posts for page: ${pageParam}`);
        const response = await axios.get(
            `/api/posts/user/${creator?.userName}?page=${pageParam}&limit=${MAX_ARTICLES_PAGE}`,
        );
        const posts = response.data.posts || [];
        console.log(`Fetched posts: `, posts);
        return posts as PostPrimitive[] | [];
    };

    const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
        queryKey:queryKeys.post.many(),
        queryFn: ({ pageParam }) => fetchPosts({ pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            console.log('Determining next page param...', lastPage, allPages);
            return lastPage.length === 0 ? undefined : allPages.length + 1;
        },
        initialPageParam: 1,
        enabled: !!creator,
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
        <div className="w-11/12 lg:3/4 xl:w-2/3 mx-auto m-3 lg:my-8">
            <section className="w-full flex items-center justify-end px-2">
                <Button
                    onClick={() => onOpen('makeImagePostModal')}
                    className="-tracking-wide text-xs md:text-sm font-bold bg-purple-800"
                >
                    Make New Post
                </Button>
            </section>
            <Separator className="my-2 md:my-3 lg:my-5 " />
            {posts && posts.length > 0 && (

                <PhotoProvider maskOpacity={0.9}>
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{ 300: 2, 500: 3, 700: 4 }}
                    >
                        {/*
                        */}
                        <Masonry gutter='1rem'>
                            {posts.map((post, index) => {
                                const refProp = index === posts.length - 1 ? { ref: lastElementRef } : {};
                                return (
                                    <PhotoView key={post.id} src={post.imageUrl}>
                                        < PostImageComponent {...refProp} imageOnly={false} post={post} />
                                    </PhotoView>
                                );
                            })}
                        </Masonry>
                    </ResponsiveMasonry>
                </PhotoProvider>
            )}
        </div>
    );
}

