'use client';
import { ArticleCard } from '@/components/Articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/store/UserDataStore';
import { ArticlePrimitive } from '@/types/primitives';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { IoOptions } from 'react-icons/io5';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import queryKeys from '@/query-key-factory';

const MAX_ARTICLES_PAGE = 10;

export default function Page() {
	const router = useRouter();
	const { loggedInUser } = useUser();
	const [searchTerm, setSearchTerm] = useState('');
	const [showDraft, setShowDraft] = useState(false);
	const queryClient = useQueryClient();
	const observer = useRef<IntersectionObserver | null>(null);

	const fetchArticles = async ({ pageParam = 1 }: { pageParam?: number }) => {
		const response = await axios.get(
			`/api/articles?page=${pageParam}&limit=${MAX_ARTICLES_PAGE}${showDraft ? '&draft=true' : ''}`,
		);
		return response.data.articles as ArticlePrimitive[] | [];
	};

	const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
		queryKey: [queryKeys.article.all, showDraft],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => fetchArticles({ pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length === MAX_ARTICLES_PAGE ? allPages.length + 1 : undefined;
		},
		enabled: !!loggedInUser,
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

	const articles = useMemo(() => {
		return data?.pages.flat();
	}, [data]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const toggleShowDraft = () => {
		setShowDraft(!showDraft);
		queryClient.invalidateQueries({ queryKey: [queryKeys.article.all, showDraft] });
	};

	const filteredArticles = articles?.filter((article) =>
		article.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<main>
			<section className="max-w-3/5 px-2 md:px-0 md:w-3/5 mx-auto">
				<div className="flex items-center justify-between mt-6 space-x-1">
					<div className="relative w-full md:w-fit">
						<Input
							className="w-full md:w-fit pl-10"
							placeholder="Search Posts"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hidden md:block" />
					</div>
					<div className="flex items-center gap-2">
						<Button className="hidden lg:flex" onClick={toggleShowDraft} variant="outline">
							{showDraft ? <AiOutlineEyeInvisible className="mr-2" /> : <AiOutlineEye className="mr-2" />}
							{showDraft ? 'Hide Drafts' : 'Show Drafts'}
						</Button>
						<Button className="hidden lg:flex" onClick={() => router.push('/articles/new')}>
							<AiOutlinePlus className="mr-2" />
							New Post
						</Button>
						<div className="lg:hidden">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										<IoOptions />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onClick={toggleShowDraft}>
										{showDraft ? 'Hide Drafts' : 'Show Drafts'}
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => router.push('/articles/new')}>
										Create new Post
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
				<Separator className="my-3" />
				{filteredArticles &&
					filteredArticles.length > 0 &&
					filteredArticles.map((article, index) => {
						const refProp = index === filteredArticles.length - 1 ? { ref: lastElementRef } : {};
						return <ArticleCard key={article.id} article={article} {...refProp} />;
					})}
				{isFetching && (
					<div className="w-full flex items-center justify-center p-3">
						<LoadingOutlined />
					</div>
				)}
				{!isLoading && filteredArticles && filteredArticles.length === 0 && (
					<p className="text-center">No articles found</p>
				)}
			</section>
		</main>
	);
}
