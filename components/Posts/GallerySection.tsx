import { Post } from '@prisma/client';
import React, { HTMLAttributes } from 'react';
import { Box } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { cn } from '@/utility/style';
import PostImageComponent from '../Posts/Post';
import { PhotoProvider, PhotoView } from 'react-photo-view';

import { LoadingOutlined } from '@ant-design/icons';

interface Props extends HTMLAttributes<HTMLDivElement> {
	posts: Post[] | null;
	isImageOnly?: boolean;
	lastElementRef?: (node: HTMLDivElement) => void;
	isFetching?: boolean;
}

export default function GallerySection({ isFetching, lastElementRef, posts, className, isImageOnly = true }: Props) {
	if (posts == null) {
		return null;
	}

	console.log({ posts, lastElementRef, isFetching });

	return (
		<section className={cn('w-full', className)}>
			<Box>
				<Masonry columns={{ xs: 2, md: 3, lg: 4 }} spacing={{ xs: 1, md: 2, lg: 2 }}>
					<PhotoProvider maskOpacity={0.9}>
						{posts?.map((post, index) => {
							const refProp = index === posts.length - 1 ? { ref: lastElementRef } : {};

							return (
								<PhotoView key={post.id} src={post.imageUrl}>
									<PostImageComponent
										{...refProp}
										imageOnly={isImageOnly}
										post={post}
										key={post.id}
									/>
								</PhotoView>
							);
						})}
					</PhotoProvider>
				</Masonry>
				{isFetching && (
					<div className="w-full flex items-center justify-center p-3">
						<LoadingOutlined />
					</div>
				)}
			</Box>
		</section>
	);
}
