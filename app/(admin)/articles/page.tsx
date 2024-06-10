'use client';
import { Button } from '@/components/ui/button';
import { useUser } from '@/store/UserDataStore';
import { Article } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Page() {
	const [articles, setArticles] = useState<Article[]>([]);
	const { loggedInUser } = useUser();

	useEffect(() => {
		const fetchArticles = async () => {
			// TODO: Fetch articles from server
			const response = await axios.get('/api/articles');
			console.log(response.data);
			setArticles(response.data.articles);
		};

		if (loggedInUser) {
			fetchArticles();
		}
	}, [loggedInUser]);

	return (
		<div>
			<Link href={'/articles/new'}>
				<Button>Create new Post</Button>
				{articles.length > 0 &&
					articles.map((article) => (
						<Link href={`/articles/${article.id}`} target='_blank'>
							<div key={article.id}>{article.title}</div>
						</Link>
					))}
			</Link>
		</div>
	);
}

