import { useInterface } from '@/store/InterfaceStore';
import { cn } from '@/utility/style';
import { Post } from '@prisma/client';
import React, { HTMLAttributes } from 'react';

interface PostProps extends HTMLAttributes<HTMLDivElement> {
	post: Post;
	imageOnly?: boolean;
}

export default function PostImageComponent({ post, imageOnly = false, className, ...props }: PostProps) {
	const { onOpen } = useInterface();
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
					<p className="font-bold text-sm lg:text-base -tracking-wide ">{post.title}</p>
					<p className="font-light text-xs lg:text-sm">{post.caption}</p>
				</div>
			)}
		</div>
	);
}
