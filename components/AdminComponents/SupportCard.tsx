import { SupportPrimitive } from '@/types/primitives';
import { cn } from '@/utility/style';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import ProfileCardComponent from '@/components/Profile/ComponentCard';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SlOptionsVertical } from 'react-icons/sl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { avatarImageUrl } from '@/utility/avatar';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import Emoji from '@/components/tools/EmojiPicker';
import { EmojiClickData } from 'emoji-picker-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import queryKeys from '@/query-key-factory';

interface Props extends HTMLAttributes<HTMLDivElement> {
	support: SupportPrimitive;
}

export default function SupportCard({ support, className }: Props) {
	const [commentText, setCommentText] = useState<string>('');
	const [isCommentVisible, setIsCommentVisible] = useState<boolean>(false);
	const queryClient = useQueryClient();

	useEffect(() => {
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsCommentVisible(false);
				setCommentText('');
			}
		};

		window.addEventListener('keydown', handleEscapeKey);

		return () => {
			window.removeEventListener('keydown', handleEscapeKey);
		};
	}, []);

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
			setCommentText('');
			setIsCommentVisible(false);
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

	const handleCommentSubmit = async () => {
		const data = {
			profileId: support.supporter?.id,
			commentText,
			supportId: support.id,
		};
		postCommentMutation.mutate(data);
	};

	const deleteSupport = async () => {
		deleteSupportMutation.mutate(support.id);
	};

	const onEmojiClick = (emojiObject: EmojiClickData) => {
		let content = commentText;
		content = content + emojiObject.emoji;
		setCommentText(content);
	};

	return (
		<div key={support.id} className="w-full">
			<div className="flex items-center gap-2">
				{support.supporter ? (
					<HoverCard>
						<HoverCardTrigger>
							<div
								className="cursor-pointer rounded-lg w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
								style={{ backgroundImage: `url(${support.supporter.imageUrl})` }}
							></div>
						</HoverCardTrigger>
						<HoverCardContent className="p-0">
							<ProfileCardComponent profile={support.supporter} />
						</HoverCardContent>
					</HoverCard>
				) : (
					<div className="hidden md:flex cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat bg-black"></div>
				)}
				<div className="flex-col space-y-0.5 md:space-y-1.5 items-center justify-start flex-1">
					<div>
						<p className="text-xs lg:text-sm">
							<span className="font-semibold">{support.supporter?.userName || support.name}</span> bought{' '}
							{support.numberOfZobo} {support.numberOfZobo > 1 ? 'zobos' : 'zobo'}
						</p>
					</div>
					{support.content && (
						<div className="p-2 w-fit bg-purple-200 rounded-sm flex items-center justify-start">
							<p className="text-xs md:text-sm">{support.content}</p>
						</div>
					)}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger className="outline-none">
						<div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5">
							<SlOptionsVertical />
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Share</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setIsCommentVisible(!isCommentVisible)}>
							Comment
						</DropdownMenuItem>
						<DropdownMenuItem onClick={deleteSupport}>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="w-full flex flex-col pl-6 lgpl-16">
				{support.comments?.map((comment) => (
					<div
						key={comment.id}
						className="p-0.5 px-1 md:p-2 w-fit bg-gray-100 rounded-sm flex items-center justify-start my-0.5 md:my-1 gap-1 md:gap-2 overflow-hidden"
					>
						<img
							className="cursor-pointer rounded-lg w-6 h-8 lg:w-8 lg:h-8 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
							src={comment.profile?.imageUrl || avatarImageUrl(comment.profile?.userName!)}
							alt="avatar"
						/>
						<p className="text-xs md:text-sm">{comment.content}</p>
					</div>
				))}
			</div>
			{isCommentVisible && (
				<div className="mt-2 flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<div className="flex items-center flex-1 border rounded-xl p-2">
							<Input
								type="text"
								className="flex-1 text-sm border-none focus-visible:ring-offset-0 focus-visible:ring-0"
								placeholder="Add a comment..."
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
							/>
							<DropdownMenu>
								<DropdownMenuTrigger className="outline-none">
									<HiOutlineEmojiHappy className="text-xl md:text-2xl text-gray-500 focus:text-purple-700" />
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<Emoji open={true} onEmojiClick={onEmojiClick} />
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<Button className="rounded-sm" onClick={handleCommentSubmit}>
							Submit
						</Button>
					</div>
					<p className="text-xs text-gray-500">Press Escape to close the comment input.</p>
				</div>
			)}{' '}
		</div>
	);
}
