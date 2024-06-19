"use client"
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

export default function Page(props: any) {
	const creatorname = props.params.username;
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
			<UserNameHeader user={creator as User} />
			<section className="flex-1 w-full flex flex-col">
				<div
					className="w-full h-72 bg-center bg-cover bg-no-repeat"
					style={{ backgroundImage: `url(${creator?.headerImageUrl})` }}
				></div>
				<div className="flex-1 flex flex-col-reverse lg:flex-row justify-center gap-3 relative items-center py-5 lg:py-3 lg:items-start bg-white lg:bg-gray-100">
					<div className="w-full lg:w-3/5 p-3 space-y-3 -mt-36 lg:-mt-32 mx-auto bg-white lg:rounded-lg">
						<div className="px-1 md:px-2 lg:px-6 py-2">
							<p className="text-md md:text-lg font-semibold tracking-wide">Articles</p>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{filteredArticles &&
								filteredArticles.map((article, index) => {
									const refProp =
										index === filteredArticles.length - 1 ? { ref: lastElementRef } : {};
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
					</div>
				</div>
			</section>
		</main>
	);
}
