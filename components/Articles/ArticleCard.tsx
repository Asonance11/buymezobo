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
import {
	AiOutlineCalendar,
	AiOutlineComment,
	AiOutlineClockCircle,
	AiOutlineShareAlt,
	AiOutlineEye,
	AiOutlineEdit,
	AiOutlineFileText,
	AiOutlineCheckCircle,
} from 'react-icons/ai';
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
			icon: <AiOutlineCheckCircle className="text-green-400 mr-1" />,
		},
		DRAFT: {
			border: 'border-blue-400',
			text: 'text-blue-400',
			bg: 'bg-blue-50',
			icon: <AiOutlineFileText className="text-blue-400 mr-1" />,
		},
	};

	return (
		<div key={article.id} className="p-2 lg:p-3 rounded-lg my-2 bg-white shadow-md space-y-0.5 md:space-y-1">
			{article.image && (
				<div
					className="w-full h-20 lg:h-32 bg-center bg-cover rounded-t-lg"
					style={{ backgroundImage: `url(${article.image})` }}
				></div>
			)}
			<div className="flex items-center justify-between">
				<p className="text-gray-600 font-light text-xs md:text-sm flex items-center gap-1">
					<AiOutlineCalendar className="text-gray-500" />
					{moment(article.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
				</p>
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger className="outline-none">
							<div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5">
								<SlOptions />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="text-xs">
							<DropdownMenuItem>
								<AiOutlineShareAlt className="mr-2" /> Share
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => router.push(`/article/${article.id}`)}>
								<AiOutlineEye className="mr-2" /> View Article
							</DropdownMenuItem>
							{loggedInUser?.id === article.profile.id && (
								<DropdownMenuItem onClick={() => router.push(`/articles/edit/${article.id}`)}>
									<AiOutlineEdit className="mr-2" /> Edit Article
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div>
				<Link
					href={loggedInUser?.id === article.profile.id ? `/article/${article.id}` : `/article/${article.id}`}
				>
					<p className="font-semibold text-md md:text-lg tracking-tight hover:underline">
						{truncateText(article.title, 70)}
					</p>
				</Link>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex font-light text-gray-500 text-xs md:text-sm tracking-tight items-center gap-3 lg:gap-6">
					<p className="flex items-center gap-1">
						<AiOutlineComment className="text-gray-500" />
						{article.comments
							? article.comments.length > 0
								? `${article.comments.length} comments`
								: 'No comments'
							: '0 comments'}
					</p>
					<p className="flex items-center gap-1">
						<AiOutlineClockCircle className="text-gray-500" />
						{calculateReadingTime(article.content as Block[])} min read
					</p>
				</div>
				<div className="flex gap-2 items-center">
					<div
						className={`p-1 md:p-2 text-xs rounded-sm font-semibold border md:border-2 flex items-center ${typeOptions[article.type].text} ${typeOptions[article.type].border} ${typeOptions[article.type].bg}`}
					>
						{typeOptions[article.type].icon} {article.type}
					</div>
				</div>
			</div>
		</div>
	);
}

