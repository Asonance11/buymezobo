import { useInterface } from '@/store/InterfaceStore';
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PostImageComponent from '../Posts/Post';
import { cn } from '@/utility/style';
import moment from 'moment';

export default function ImageSeclectModal() {
	const { type, data, isOpen, onClose } = useInterface();
	const open = isOpen && type == 'imageSelectModal';

	const { post } = data;

	if (!post) {
		return null;
	}

	const imageOnly = false;

	const posted = moment(new Date(post.createdAt)).format('MMM Do YYYY');

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="flex flex-col items-center justify-center rounded-lg p-0 w-screen lg:w-fit ">
				<div className={cn('cursor-pointer overflow-hidden boorder-[0.5px] rounded-lg')}>
					<div className={cn('relative overflow-hidden', imageOnly ? 'h-full' : null)}>
						<img className="w-full h-full max-h-[45rem]" src={post.imageUrl} alt={post.title} />
					</div>

					{imageOnly ? null : (
						<div className="p-3">
							<p className="font-bold text-sm lg:text-base -tracking-wide flex items-center gap-2 ">
								{post.title} • <span className="text-xs font-light text-gray-500">{posted}</span>
							</p>
							<p className="font-light text-xs lg:text-sm">{post.caption}</p>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
