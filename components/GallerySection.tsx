import { Post } from '@prisma/client';
import React, { HTMLAttributes } from 'react';
import PostImageComponent from './common/Post';
import PinterestGrid from 'rc-pinterest-grid';
import { Box } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { cn } from '@/utility/style';

interface Props extends HTMLAttributes<HTMLDivElement> {
	posts: Post[] | null;
	isImageOnly?: boolean;
}

export default function GallerySection({ posts, className, isImageOnly = true }: Props) {
	if (posts == null) {
		return null;
	}

	return (
		<section className={cn('w-full', className)}>
			<Box>
				<Masonry columns={{ xs: 2, md: 3, lg: 4 }} spacing={{ xs: 1, md: 2, lg: 2 }} sequential>
					{posts?.map((post) => <PostImageComponent imageOnly={isImageOnly} post={post} key={post.id} />)}
				</Masonry>
			</Box>
		</section>
	);
}
