import { getCreatorPosts } from '@/actions/posts';
import { Post } from '@prisma/client';
import { User } from 'lucia';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utility/style';
import { Button } from '../ui/button';

interface Props extends HTMLAttributes<HTMLDivElement> {
	creator: User | null;
}

export default function PostPage({ creator, className }: Props) {
	const [posts, setposts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getposts = async () => {
			setLoading(true);
			const posts = await getCreatorPosts(creator!.id, 4);
			setposts(posts);
			setLoading(false);
		};
		if (creator) {
			getposts();
		}
	}, [creator?.id, creator]);

	return (
		<div>
			{!creator && (
				<div
					className={cn(
						`transition-all max-h-[30rem] overflow-y-auto duration-300 p-7 md:p-10 w-[27rem] md:w-full rounded-2xl bg-white flex flex-col gap-3 items-start h-fit`,
						className,
					)}
				>
					<Separator className="my-2" />
					<div className="spce-y-4 w-full">
						{[1, 2, 3, 4, 5].map((index) => (
							<Skeleton key={index} className="py-3 w-full "></Skeleton>
						))}
					</div>
				</div>
			)}
			{creator && (
				<div
					className={cn(
						`transition-all lg:max-h-[20rem] bg-white overflow-y-auto duration-300 p-2 md:px-3 md:py-2 w-full rounded-2xl flex flex-col gap-3 items-start h-fit`,
						className,
					)}
				>
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 p-2 lg:p-4">
						{posts.map((post) => (
							<div key={post.id} className="bg-red-700 w-full h-full overflow-hidden rounded-lg">
								<img
									src={post.imageUrl}
									alt={post.title}
									className="w-full h-full object-cover cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
								/>
							</div>
						))}
					</div>{' '}
					<Button className="w-full" variant={'secondary'}>
						See all posts
					</Button>
				</div>
			)}
		</div>
	);
}
