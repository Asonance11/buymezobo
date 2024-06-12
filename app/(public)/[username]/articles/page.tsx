'use client';
import { getCreatorPosts } from '@/actions/posts';
import GallerySection from '@/components/Posts/GallerySection';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { getCreatorByName } from '@/lib/creator';
import { Post } from '@prisma/client';
import { User } from 'lucia';
import React, { useEffect, useState } from 'react';
import Loading from '../../loading';
import { ArticlePrimitive } from '@/types/primitives';
import axios from 'axios';
import { useUser } from '@/store/UserDataStore';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArticleCard } from '@/components/Articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { routeModule } from 'next/dist/build/templates/pages';
import { notFound, useRouter } from 'next/navigation';

export default function Page(props: any) {
	const creatorname = props.params.username;
	const [creator, setCreator] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [articles, setArticles] = useState<ArticlePrimitive[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const router = useRouter();

	useEffect(() => {
		const getPost = async () => {
			//const post = await axios.get(`/api/articles/${creatorname}`);
			const post = await axios.get(`/api/articles/user/${creator?.userName}`);
			console.log(post);
			setArticles(post.data.articles || []);
			setLoading(false);
		};
		if (creator) {
			getPost();
		}
	}, [creator?.id, creator, creatorname]);

	useEffect(() => {
		const getUser = async () => {
			const creator = await getCreatorByName(creatorname);
			if (!creator) {
				notFound();
			}
			setCreator(creator as User);
		};
		if (creatorname) {
			getUser();
		}
	}, [creatorname]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	if (!creator || loading) {
		return (
			<div className="w-full min-h-screen flex items-center justify-center">
				<Loading />
			</div>
		);
	}

	const filteredArticles = articles?.filter((article) =>
		article.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<main className="min-h-screen flex flex-col ">
			{loading ? (
				<Loading />
			) : (
				<>
					<UserNameHeader className="" user={creator} />
					<section className="flex-1 w-full flex flex-col ">
						<div
							className="w-full h-72 bg-center bg-cover bg-no-repeat"
							style={{ backgroundImage: `url(${creator?.headerImageUrl})` }}
						></div>
						<div className="flex-1 flex flex-col-reverse lg:flex-row justify-center gap-3 relative items-center py-5 lg:py-3 lg:items-start bg-white lg:bg-gray-100 ">
							<div className=" w-10/11 md:w-3/4 lg:w-3/5 p-3 space-y-3 -mt-36  lg:-mt-32 mx-auto bg-white lg:rounded-lg ">
								<div className="px-1 md:px-2 lg:px-6 py-2">
									<p className="text-md md:text-lg font-semibold -tracking-wide">Articles</p>
									{articles.length > 0 && (
										<div className="flex justify-between mt-2 ">
											<Input
												className="w-1/3"
												placeholder="Search Posts"
												value={searchTerm}
												onChange={handleSearchChange}
											/>
										</div>
									)}
								</div>
								{articles.length > 0 &&
									filteredArticles.map((article) => (
										<ArticleCard key={article.id} article={article} />
									))}
								{articles.length <= 0 && (
									<div className="w-full h-80 flex items-center justify-center">
										<div>
											<p className="font-bold text-lg tracking-wide">
												{creatorname} has no articles
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</section>
				</>
			)}
		</main>
	);
}
