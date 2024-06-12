import { ArticlePrimitive } from '@/types/primitives';
import React from 'react';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import moment from 'moment';
import Link from 'next/link';
import { SlOptions } from 'react-icons/sl';
import { useRouter } from 'next/navigation';
import { useUser } from '@/store/UserDataStore';
import { truncateText } from '@/utility/text';
import { calculateReadingTime } from '@/utility/articles';
import { Block } from '@/types/blocknote';

interface Props {
	article: ArticlePrimitive;
}

export function ArticleCard({ article }: Props) {
	const { loggedInUser } = useUser();
	const router = useRouter();

	const typeOptions = {
		PUBLISHED: {
			border: 'border-green-400',
			text: 'text-green-400',
			bg: 'bg-green-50',
		},
		DRAFT: {
			border: 'border-blue-400',
			text: 'text-blue-400',
			bg: 'bg-blue-50',
		},
	};

	return (
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
							{loggedInUser?.id === article.profile.id && (
								<DropdownMenuItem onClick={() => router.push(`/articles/edit/${article.id}`)}>
									Edit Article
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div>
				<Link
					href={
						loggedInUser?.id === article.profile.id
							? `/articles/edit/${article.id}`
							: `/article/${article.id}`
					}
					target="_blank"
				>
					<p className="font-semibold text-lg tracking-tight">{truncateText(article.title, 70)}</p>
				</Link>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex font-light text-gray-500 text-sm tracking-tight items-center gap-3 lg:gap-6">
					<p>
						{' '}
						{article.comments
							? article.comments?.length > 0
								? `${article.views} comments`
								: 'No comments'
							: '0 comments'}
					</p>
					<p>{article.views > 0 ? `${article.views} views` : 'No views yet'}</p>
					<p className="font-light text-xs">{calculateReadingTime(article.content as Block[])} min read</p>
				</div>
				<div className="flex gap-2 items-center ">
					<div
						className={`p-2 text-xs rounded-sm font-semibold border-2 ${typeOptions[article.type].text + ' ' + typeOptions[article.type].border + ' ' + typeOptions[article.type].bg} `}
					>
						{article.type}
					</div>
				</div>
			</div>
		</div>
	);
}
