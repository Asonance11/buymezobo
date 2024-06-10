'use client';

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Editor from '@/components/Editor/Editor';
import ProfileCardComponent from '@/components/Profile/ComponentCard';
import UserButton from '@/components/Profile/UserButton';
import Loader from '@/components/common/Loader';
import { ArticlePrimitive } from '@/types/primitives';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { truncateText } from '@/utility/text';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { User } from 'lucia';

export default function Page(props: any) {
	const articleId = props.params.articleId;

	const [article, setArticle] = useState<ArticlePrimitive | null>(null);

	useEffect(() => {
		const fetchArticle = async (id: string) => {
			const response = await axios.get(`/api/articles/${id}`);
			console.log(response.data.article);
			setArticle(response.data.article);
		};
		if (articleId) {
			fetchArticle(articleId);
		}
	}, [articleId]);

	if (!article) {
		return (
			<div className="w-full min-h-screen flex items-center justify-center">
				<Loader />;
			</div>
		);
	}

	const date = moment(article.createdAt).format('MMMM Do YYYY, h:mm:ss a'); // June 10th 2024, 6:43:57 pm

	return (
		<main className='bg-gray-100'>
        <UserNameHeader user={article.profile as User} />
			<main className=" w-full lg:w-3/4 mx-auto grid grid-cols-1 lg:grid-cols-[65%_35%] p-2 md:py-6 md:px-16 h-full gap-4 ">
				<section className="space-y-2">
                    <div className=' mx-auto p-6 '>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/${article.profile.userName}`}>{article.profile.userName}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/${article.profile.userName}/articles`}>Articles</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{ truncateText( article.title, 30) }</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
					{article.image ? (
						<div
							className="flex gap-3  bg-red-400 h-40 lg:h-56 bg-center bg-cover bg-no-repeat rounded-lg"
							style={{ backgroundImage: `url(${article.image})` }}
						></div>
					) : null}
					<div className="p-4 pl-14">
						<p className="text-lg font-bold -tracking-wide">{article.title}</p>
						<div className="flex items-center justify-start gap-1.5">
							<div
								className="cursor-pointer rounded-lg w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
								style={{ backgroundImage: `url(${article.profile.imageUrl})` }}
							></div>

							<div>
								<p className="hover:underline font-semibold text-gray-800 cursor-pointer">
									@{article.profile.userName}
								</p>
								<p className="font-extralight text-sm text-gray-600">created at {date}</p>
							</div>
						</div>
					</div>

					<div className="py-6 bg-white rounded-lg">
						<Editor readOnly initialValues={article.content} previewMode />
					</div>
				</section>
				<aside className="">
					<ProfileCardComponent profile={article.profile} className="sticky top-2" />
				</aside>
			</main>
		</main>
	);
}
