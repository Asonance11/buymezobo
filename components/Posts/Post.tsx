import { useInterface } from '@/store/InterfaceStore';
import { useUser } from '@/store/UserDataStore';
import { cn } from '@/utility/style';
import { truncateText } from '@/utility/text';
import { Post } from '@prisma/client';
import React, { HTMLAttributes, useState } from 'react';
import { SlOptions } from 'react-icons/sl';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/query-key-factory';
import { useEffect } from 'react';

interface PostProps extends HTMLAttributes<HTMLDivElement> {
	post: Post;
	imageOnly?: boolean;
}

export default function PostImageComponent({ post, imageOnly = false, className, ...props }: PostProps) {
	const { loggedInUser } = useUser();

	const [isTheSameUser, setIsTheSameUser] = useState(false);

	useEffect(() => {
		if (loggedInUser && post && loggedInUser.id == post.profileId) {
			setIsTheSameUser(true);
		}
	}, [loggedInUser, post]);

	const queryClient = useQueryClient();

	const deletePostMutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await axios.delete(`/api/posts/${id}/image`);
			if (response.status > 299) throw new Error(response.statusText);
			return;
		},
		onError(error) {
			throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.post.all });
		},
	});

	const deleteImage = async () => {
		try {
			//deletePostMutation.mutate(post.id);
			const deletePromise = new Promise((resolve, reject) => {
				deletePostMutation.mutate(post.id, {
					onSuccess: resolve,
					onError: reject,
				});
			});

			toast.promise(deletePromise, {
				loading: 'Deleting image...',
				success: 'Image deleted successfully!',
				error: 'Failed to delete image',
			});
		} catch (e) {
			console.log(e);
			toast.error('Failed to delete image');
		}
	};

	const shareImage = async () => {};

	return (
		<div {...props} className={cn('cursor-pointer overflow-hidden border-[0.5px] rounded-lg', className)}>
			<div className={cn('relative overflow-hidden', imageOnly ? 'h-full' : null)}>
				<img
					className="w-full h-auto transition-transform duration-500 hover:scale-110 "
					src={post.imageUrl}
					alt={post.title}
				/>
			</div>

			{imageOnly ? null : (
				<div className="p-3">
					<div className="flex justify-between items-center">
						<p className="font-bold text-sm lg:text-base -tracking-wide ">{post.title}</p>

						{isTheSameUser ? (
							<DropdownMenu>
								<DropdownMenuTrigger className="outline-none">
									<div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5 border-none focus:outline-none">
										<SlOptions />
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem>Share</DropdownMenuItem>
									<>
										<DropdownMenuItem onClick={() => deleteImage()}>Delete</DropdownMenuItem>
									</>
								</DropdownMenuContent>
							</DropdownMenu>
						) : null}
					</div>
					<p className="font-light text-xs lg:text-sm">{truncateText(post.caption, 30)}</p>
				</div>
			)}
		</div>
	);
}
