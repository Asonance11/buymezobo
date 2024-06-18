'use client';
import { ArticleCard } from '@/components/Articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/store/UserDataStore';
import { ArticlePrimitive } from '@/types/primitives';
import { Article } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
	const router = useRouter();
	const [articles, setArticles] = useState<ArticlePrimitive[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const { loggedInUser } = useUser();

	useEffect(() => {
		const fetchArticles = async () => {
			const response = await axios.get('/api/articles');
			setArticles(response.data.articles);
		};

		if (loggedInUser) {
			fetchArticles();
		}
	}, [loggedInUser]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const filteredArticles = articles.filter((article) =>
		article.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<main>
			<section className="max-w-3/5 px-2 md:px-0 md:w-3/5 mx-auto">
				<div className="flex items-center justify-end mt-6 space-x-1">
					<Input
						className="w-fit hidden"
						placeholder="Search Posts"
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<Button onClick={() => router.push('/articles/new')}>Create new Post</Button>
				</div>
				<Separator className="my-3" />
				{filteredArticles.length > 0 &&
					filteredArticles.map((article) => <ArticleCard key={article.id} article={article} />)}
			</section>
		</main>
	);
}
