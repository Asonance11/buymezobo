'use client';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/store/UserDataStore';
import { Article } from '@prisma/client';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SlOptions } from 'react-icons/sl';

export default function Page() {
	const router = useRouter();
	const [articles, setArticles] = useState<Article[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const { loggedInUser } = useUser();

	useEffect(() => {
		const fetchArticles = async () => {
			// TODO: Fetch articles from server
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
			<section className="w-3/5 mx-auto">
				<div className="flex items-center justify-between">
					<Input
						className="w-fit"
						placeholder="Search Posts"
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<Button onClick={() => router.push('/articles/new')}>Create new Post</Button>
				</div>
				<Separator className="my-3" />
				{filteredArticles.length > 0 &&
					filteredArticles.map((article) => (
						<div key={article.id} className="p-4 rounded-lg m-3 bg-white space-y-3">
							<div className="flex items-center justify-between">
								<p className="text-gray-600 font-light text-sm">
									Posted at {moment(article.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
								</p>
								<div>
									<DropdownMenu>
										<DropdownMenuTrigger className="outline-none">
											<div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5">
												<SlOptions />
											</div>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem>Share</DropdownMenuItem>
											<DropdownMenuItem onClick={() => router.push(`/article/${article.id}`)}>
												View Article
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
							<div>
								<Link href={`/articles/edit/${article.id}`} target="_blank">
									<p className="font-semibold">{article.title}</p>
								</Link>
							</div>
							<div></div>
						</div>
					))}
			</section>
		</main>
	);
}

