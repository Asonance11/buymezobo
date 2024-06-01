import { useInterface } from '@/store/InterfaceStore';
import { useUser } from '@/store/UserDataStore';
import { cn } from '@/utility/style';
import { truncateText } from '@/utility/text';
import { Post } from '@prisma/client';
import Image from 'next/image';
import React, { HTMLAttributes, useState } from 'react';
import { SlOptions } from 'react-icons/sl';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostProps extends HTMLAttributes<HTMLDivElement> {
	post: Post;
	imageOnly?: boolean;
}

export default function PostImageComponent({ post, imageOnly = false, className, ...props }: PostProps) {
	const { loggedInUser } = useUser();

	const { onOpen } = useInterface();

	const [isTheSameUser, setIsTheSameUser] = useState(true);

	const deleteImage = async () => {};
	const shareImage = async () => {};

	return (
		<div
			{...props}
			onClick={() => onOpen('imageSelectModal', { post })}
			className={cn('cursor-pointer overflow-hidden border-[0.5px] rounded-lg', className)}
		>
			<div className={cn('relative overflow-hidden', imageOnly ? 'h-full' : null)}>
				<img
					className="w-full h-auto transition-transform duration-500 hover:scale-110"
					src={post.imageUrl}
					alt={post.title}
				/>
			</div>

			{imageOnly ? null : (
				<div className="p-3">
					<div className="flex justify-between items-center">
						<p className="font-bold text-sm lg:text-base -tracking-wide ">{post.title}</p>

						{/*loggedInUser?.id == post.profileId ? <SlOptions /> : null*/}
						<DropdownMenu>
							<DropdownMenuTrigger className="outline-none">
								<div className="rounded-full hover:bg-zinc-200 transition-colors duration-300 cursor-pointer p-1.5 border-none focus:outline-none">
									<SlOptions />
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>Share</DropdownMenuItem>
								{isTheSameUser ? (
									<>
										<DropdownMenuItem>Comment</DropdownMenuItem>
										<DropdownMenuItem>Delete</DropdownMenuItem>
									</>
								) : null}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<p className="font-light text-xs lg:text-sm">{truncateText(post.caption, 30)}</p>
				</div>
			)}
		</div>
	);
}
