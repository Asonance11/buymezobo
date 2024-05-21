import { cn } from '@/utility/style';
import { Post } from '@prisma/client';
import React, { HTMLAttributes } from 'react';

interface PostProps extends HTMLAttributes<HTMLDivElement> {
	post: Post;
	imageOnly?: boolean;
}

export default function PostImageComponent({ post, imageOnly = false, className, ...props }: PostProps) {
	return (
		<div {...props} className={cn('overflow-hidden border-[0.5px] rounded-lg', className)}>
			<div className="relative overflow-hidden">
				<img
					className="w-full h-auto transition-transform duration-500 hover:scale-110"
					src={post.imageUrl}
					alt={post.title}
				/>
			</div>

			{imageOnly ? null : (
				<div className="p-3">
					<p className="font-bold -tracking-wide ">{post.title}</p>
					<p className="font-light text-xs lg:text-sm">{post.caption}</p>
				</div>
			)}
		</div>
	);
}
