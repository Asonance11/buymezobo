'use client';
import { ArticleCard } from '@/components/Articles/ArticleCard';
import queryKeys from '@/query-key-factory';
import { LoadingOutlined } from '@ant-design/icons';
import { ArticlePrimitive } from '@/types/primitives';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { User } from 'lucia';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { notFound, useRouter } from 'next/navigation';
import Loading from '../../loading';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { getCreatorByName } from '@/lib/creator';

interface Props {
	creatorname: string;
	tabValue: string;
}

export default function ArticlesTab({ creatorname, tabValue }: Props) {
	const [creator, setCreator] = useState<User | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [showDraft, setShowDraft] = useState(false);
	const [loadingCreator, setLoadingCreator] = useState(true);
	const queryClient = useQueryClient();
	const observer = useRef<IntersectionObserver | null>(null);
	const router = useRouter();

	const MAX_ARTICLES_PAGE = 10;

	const fetchArticles = async ({ pageParam = 1 }: { pageParam?: number }) => {
		const response = await axios.get(
			`/api/articles/user/${creatorname}?page=${pageParam}&limit=${MAX_ARTICLES_PAGE}${showDraft ? '&draft=true' : ''}`,
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
		enabled: tabValue === "articles",
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

	useEffect(() => {
		const getUser = async () => {
			setLoadingCreator(true);
			const creator = await getCreatorByName(creatorname);
			if (!creator) {
				notFound();
			}
			setCreator(creator as User);
			setLoadingCreator(false);
		};
		if (creatorname) {
			getUser();
		}
	}, [creatorname]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const toggleShowDraft = () => {
		setShowDraft(!showDraft);
		queryClient.invalidateQueries({ queryKey: [queryKeys.article.all, showDraft] });
	};

	if (loadingCreator) return <Loading />;
	if (isLoading) return <h1>Loading...</h1>;
	if (error) return <h1>Error fetching data...</h1>;

	const filteredArticles = articles?.filter((article) =>
		article.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<main className="min-h-screen flex flex-col">
			<section className="flex-1 w-full flex flex-col">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{filteredArticles &&
							filteredArticles.map((article, index) => {
								const refProp = index === filteredArticles.length - 1 ? { ref: lastElementRef } : {};
								return <ArticleCard key={article.id} article={article} {...refProp} />;
							})}
					</div>
					{articles && articles.length <= 0 && (
						<div className="w-full h-80 flex items-center justify-center">
							<div>
								<p className="font-bold text-lg tracking-wide">{creatorname} has no articles</p>
							</div>
						</div>
					)}
					{isFetching && (
						<div className="w-full flex items-center justify-center p-3">
							<LoadingOutlined />
						</div>
					)}
			</section>
		</main>
	);
}
