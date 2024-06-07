import { getCreatorSupports } from '@/actions/support';
import { Button } from '@/components/ui/button';
import { useUser } from '@/store/UserDataStore';
import { cn } from '@/utility/style';
import { Post, Support as SupportType, Comment as CommentType, Profile } from '@prisma/client';
import { User } from 'lucia';
import Link from 'next/link';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { SlOptions } from 'react-icons/sl';
import { useEventListener } from 'usehooks-ts';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { avatarImageUrl } from '@/utility/avatar';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import { FaHeart } from 'react-icons/fa';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import ProfileCardComponent from '@/components/Profile/ComponentCard';
import Loader from '@/components/common/Loader';
import { EmojiClickData } from 'emoji-picker-react';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import Emoji from '@/components/tools/EmojiPicker';

interface Props extends HTMLAttributes<HTMLDivElement> {
	post: Post | null;
	creator: User;
	reload: boolean;
}

interface Comment extends CommentType {
	profile: Profile;
}

interface Support extends SupportType {
	comments?: Comment[];
	supporter?: Profile;
}

// TODO: Migrate file to react query

export default function SupportersCard({ post, creator, reload, className }: Props) {
	const [supports, setSupports] = useState<Support[]>([]); // this is just criminal tbh
	const [count, setCount] = useState(0);
	const [isTheSameUser, setIsTheSameUser] = useState(false);
	const queryClient = useQueryClient();

	const [activeComment, setActiveComment] = useState<string | null>(null);
	const [commentText, setCommentText] = useState<string>('');

	const { loggedInUser } = useUser();

	const {
		data: creatorSupports,
		fetchStatus,
		status,
		isLoading,
		isFetching,
		isPending,
	} = useQuery({
		queryKey: queryKeys.support.many(),
		queryFn: () => getCreatorSupports(creator!.id),
		enabled: !!creator,
		refetchOnWindowFocus: false,
	});

	const postCommentMutation = useMutation({
		mutationFn: async (data: { profileId: string | undefined; commentText: string; supportId: string }) => {
			const response = await fetch('api/support/comment', { body: JSON.stringify(data), method: 'POST' });
			if (response.status > 299) throw new Error(response.statusText);
			const result = await response.json();
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [...queryKeys.support.all] });
			toast.message('Comment sent');
		},
		onError(error) {
			toast.error(error.message);
			throw error;
		},
	});

	const deleteSupportMutation = useMutation({
		mutationFn: async (supportId: string) => {
			const response = await fetch(`api/support/${supportId}`, { method: 'DELETE' });
			if (response.status > 299) throw new Error(response.statusText);
			const result = await response.json();
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [...queryKeys.support.all] });
			toast.message('Support deleted successfully');
		},
		onError(error) {
			toast.error(error.message);
			throw error;
		},
	});

	useEffect(() => {
		if (creator?.id == loggedInUser?.id) {
			setIsTheSameUser(true);
		}
	}, [loggedInUser?.id]);

	useEffect(() => {
		if (fetchStatus === 'idle' && status === 'success') {
			//console.log(creatorSupports.data);
			setSupports(creatorSupports.data);
		}
		if (fetchStatus === 'idle' && status === 'error') toast.error('An error occurred');
	}, [fetchStatus, status]);

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			setActiveComment(null);
			setCommentText('');
		}
	};

	useEventListener('keydown', onKeyDown);

	const handleCommentClick = (supportId: string) => {
		setActiveComment(activeComment === supportId ? null : supportId);
		setCommentText(''); // Reset comment text when opening a new comment box
	};

	const handleCommentSubmit = async (supportId: string) => {
		// Handle comment submission logic here
		const data = {
			profileId: loggedInUser?.id,
			commentText,
			supportId,
		};
		postCommentMutation.mutate(data);
		setSupports(postCommentMutation.data);
		// Reset comment state
		setActiveComment(null);
		setCommentText('');
	};

	const deleteSupport = async (supportId: string) => {
		deleteSupportMutation.mutate(supportId);
		setSupports(deleteSupportMutation.data);
	};

	if (isLoading || isFetching || isPending) {
		return (
			<div className="w-full h-full rounded-lg bg-purple-200 flex items-center justify-center py-20 lg:py-28">
				<Loader />
			</div>
		);
	}

	//emoji stuff
	const onEmojiClick = (emojiObject: EmojiClickData) => {
		console.log(emojiObject.emoji);
		let content = commentText;
		content = content + emojiObject.emoji;
		setCommentText(content);
	};

	if (!supports) {
		return null;
	}

	return (
		<div
			className={cn(
				`transition-all duration-300 p-5 md:p-7 lg:p-8 w-screen md:w-[32rem] lg:w-[33rem] rounded-none md:rounded-2xl bg-white flex flex-col gap-3 items-start h-fit `,
				className,
			)}
		>
			<div className="space-y-2 md:spce-y-4 w-full">
				{supports.length < 1 ? (
					<div className="w-full h-full rounded-lg bg-purple-200 flex items-center justify-center py-20 lg:py-28">
						<div className="flex items-center justify-center flex-col relative gap-3 text-center">
							<FaHeart className="text-purple-900 text-xl animate-heartbeat" />
							<p className="font-bold text-purple-950 text-xs md:text-sm">
								Be the first one to support {creator.userName}
							</p>
						</div>
					</div>
				) : (
					supports?.map((support) => {
						//console.log(support.supporter);
						return (
							<div key={support.id} className=" w-full ">
								<div className="flex items-center gap-2 ">
									{support.supporter ? (
										<HoverCard>
											<HoverCardTrigger>
												<div
													className="cursor-pointer rounded-lg w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
													style={{ backgroundImage: `url(${support.supporter!.imageUrl})` }}
												></div>
											</HoverCardTrigger>
											<HoverCardContent className="p-0">
												<ProfileCardComponent profile={support.supporter} />
											</HoverCardContent>
										</HoverCard>
									) : (
										<div className="hidden md:flex cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat bg-black "></div>
									)}
									<div className="flex-col space-y-0.5 md:space-y-1.5 items-center justify-start flex-1">
										<div>
											<p className="text-xs lg:text-sm ">
												<span className="font-semibold">
													{support.supporter?.userName || support.name}
												</span>{' '}
												bought {support.numberOfZobo}{' '}
												{support.numberOfZobo > 1 ? 'zobos' : 'zobo'}
											</p>
										</div>
										{support.content ? (
											<div className="p-2 w-fit bg-purple-200 rounded-sm flex items-center justify-start">
												<p className="text-xs md:text-sm">{support.content}</p>
											</div>
										) : null}
									</div>

									<>
										{/* Dropdown for comment options */}
										<DropdownMenu>
											<DropdownMenuTrigger className="outline-none">
												<div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5">
													<SlOptions />
												</div>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem>Share</DropdownMenuItem>
												{isTheSameUser ? (
													<>
														<DropdownMenuItem
															onClick={() => handleCommentClick(support.id)}
														>
															Comment
														</DropdownMenuItem>
														<DropdownMenuItem onClick={() => deleteSupport(support.id)}>
															Delete
														</DropdownMenuItem>
													</>
												) : null}
											</DropdownMenuContent>
										</DropdownMenu>
									</>
								</div>
								<div className="w-full flex flex-col pl-6 lgpl-16">
									{support.comments?.map((comment) => {
										return (
											<div
												key={comment.id}
												className=" p-0.5 px-1 md:p-2 w-fit bg-gray-100 rounded-sm flex items-center justify-start my-0.5 md:my-1 gap-1 md:gap-2 overflow-hidden"
											>
												<img
													className="cursor-pointer rounded-lg w-6 h-8 lg:w-8 lg:h-8 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
													src={
														comment.profile?.imageUrl ||
														avatarImageUrl(comment.profile?.userName!)
													}
													alt="avatar"
												/>

												<p className="text-xs md:text-sm">{comment.content}</p>
											</div>
										);
									})}
								</div>
								{activeComment === support.id && (
									<div className="mt-2 flex items-center gap-2">
										<div className="flex items-center flex-1 border rounded-xl p-2 ">
											<Input
												type="text"
												className="flex-1 text-sm border-none focus-visible:ring-offset-0 focus-visible:ring-0"
												placeholder="Add a comment..."
												value={commentText}
												onChange={(e) => setCommentText(e.target.value)}
											/>
											<DropdownMenu>
												<DropdownMenuTrigger className="outline-none">
													<HiOutlineEmojiHappy className="text-xl md:text-2xl text-gray-500 focus:text-purple-700 " />{' '}
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													<Emoji open={true} onEmojiClick={onEmojiClick} />
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
										<Button className="rounded-sm" onClick={() => handleCommentSubmit(support.id)}>
											Submit
										</Button>
									</div>
								)}
							</div>
						);
					})
				)}
			</div>

			{supports.length > 4 ? (
				<Button className="w-full font-semibold" variant={'secondary'}>
					<Link href="/dashboard/support-history?page=1" className=" w-full h-full">
						See all supporters
					</Link>
				</Button>
			) : null}
		</div>
	);
}
