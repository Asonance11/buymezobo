'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import {
	Breadcrumb,
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
import { ArticlePrimitive, CommentPrimitive } from '@/types/primitives';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { truncateText } from '@/utility/text';
import UserNameHeader from '@/components/Headers/UsernameHeader';
import { User } from 'lucia';
import Link from 'next/link';
import { calculateReadingTime } from '@/utility/articles';
import { Block } from '@/types/blocknote';
import { useUser } from '@/store/UserDataStore';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { EmojiClickData } from 'emoji-picker-react';
import Emoji from '@/components/tools/EmojiPicker';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { avatarImageUrl } from '@/utility/avatar';
import { Profile } from '@prisma/client';
import { SendIcon } from 'lucide-react';

export default function Page(props: any) {
	const articleId = props.params.articleId;

	const [article, setArticle] = useState<ArticlePrimitive | null>(null);
	const [comments, setComments] = useState<CommentPrimitive | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [isEmojiOpen, setIsEmojiOpen] = useState(true);
	const [commentInput, setCommentInput] = useState<string>('');

	const { loggedInUser } = useUser();

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
				<Loader />
			</div>
		);
	}

	const onCommentSubmit = async () => {
		if (loading) {
			return;
		}
		try {
			setLoading(true);
			await axios.post(`/api/comments/`, {
				content: commentInput,
				author: loggedInUser,
				parentId: article.id,
			});

			toast.success('Comment submitted');
		} catch (error) {
			toast.error('Failed to submit your comment');
		} finally {
			setLoading(false);
		}
	};

	const date = moment(article.createdAt).format('MMMM Do YYYY, h:mm:ss a'); // June 10th 2024, 6:43:57 pm

	const onEmojiClick = (emojiObject: EmojiClickData) => {
		console.log(emojiObject.emoji);
		const content = commentInput + emojiObject.emoji;
		setCommentInput(content);
	};

	return (
		<main className="bg-gray-100">
			<UserNameHeader user={article.profile as User} />
			<main className=" w-full lg:w-2/4 mx-auto flex flex-col p-2 md:py-6 md:px-16 h-full gap-4 ">
				<section className="space-y-2">
					<div className=" mx-auto p-4 ">
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href={`/${article.profile.userName}`}>
										{article.profile.userName}
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink href={`/${article.profile.userName}/articles`}>
										Articles
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>{truncateText(article.title, 30)}</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className="p-4 space-y-3 ">
						<p className="text-3xl font-bold -tracking-wide">{article.title}</p>
						<div className="flex items-center justify-start gap-1.5">
							<div
								className="cursor-pointer rounded-lg w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
								style={{ backgroundImage: `url(${article.profile.imageUrl})` }}
							></div>

							<div>
								<Link href={`/${article.profile.userName}`}>
									<p className="hover:underline font-semibold text-gray-800 cursor-pointer">
										@{article.profile.userName}
									</p>
								</Link>
								<p className="font-extralight text-sm text-gray-600">created at {date}</p>
							</div>
						</div>
					</div>
					{article.image ? (
						<div
							className="flex gap-3  bg-red-400 h-40 lg:h-56 bg-center bg-cover bg-no-repeat rounded-lg"
							style={{ backgroundImage: `url(${article.image})` }}
						></div>
					) : null}

					<div className="py-6 bg-white rounded-lg">
						<Editor readOnly initialValues={article.content} previewMode />
					</div>
				</section>
				<div className=" max-w-[30rem]">
					<ProfileCardComponent profile={article.profile} className="sticky top-2 hidden" />
				</div>
				{!loggedInUser ? (
					<div className="w-full h-40">
						<Button>Sign in to comment</Button>
					</div>
				) : (
					<section className="p-4 flex gap-2">
						<div
							className="cursor-pointer rounded-lg w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
							style={{ backgroundImage: `url(${avatarImageUrl(loggedInUser as Profile)})` }}
						></div>

						<div className="border-gray-200 border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white flex-1">
							<Textarea
								className="resize-none border-none focus:border-none focus-visible:ring-offset-0 focus-visible:ring-0"
								placeholder="Say something nice"
								value={commentInput}
								onChange={(e) => setCommentInput(e.target.value)}
							/>
							<div className="w-full p-2.5 flex items-center justify-end gap-2">
								<DropdownMenu>
									<DropdownMenuTrigger className="outline-none">
										<HiOutlineEmojiHappy className="text-xl md:text-2xl text-gray-500 focus:text-purple-700 " />{' '}
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<Emoji open={isEmojiOpen} onEmojiClick={onEmojiClick} />
									</DropdownMenuContent>
								</DropdownMenu>
								<div className="p-1.5 hover:bg-gray-100 transition-all duration-300 rounded-lg">
									<SendIcon
										onClick={onCommentSubmit}
										className="text-xl md:text-2xl text-gray-500 cursor-pointer"
									/>
								</div>
							</div>
						</div>
					</section>
				)}
			</main>
		</main>
	);
}
