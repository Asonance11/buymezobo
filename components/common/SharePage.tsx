'use client';
import React, { HTMLAttributes, useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { MdIosShare } from 'react-icons/md';
import { Profile } from '@prisma/client';
import { cn } from '@/utility/style';
import { useOrigin } from '@/hooks/useOrigin';
import { IoCopyOutline } from 'react-icons/io5';
import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { User } from 'lucia';
import { Optional } from '@prisma/client/runtime/library';

interface SharePageProps extends HTMLAttributes<HTMLButtonElement> {
	profile: Optional<User>;
}

export default function SharePage({ profile, className }: SharePageProps) {
	const [copied, setCopied] = useState(false);

	const origin = useOrigin();
	const inviteUrl = `${origin}/${profile.userName}`;
	const originalUrl = `https://twitter.com/intent/post?text=I%E2%80%99m+on+%40buymezobo.+If+you+like+my+work%2C+you+can+support+me+with+a+drink+and+share+your+thoughts+%F0%9F%8E%89%E2%98%95+https%3A%2F%2Fwww.buymezobo.com%2F${profile.userName}`;

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button
					className={cn('px-2.5 lg:px-4 flex gap-1.5 bg-black flex-nowrap text-xs hover:bg-black', className)}
				>
					<MdIosShare className="text-lg" />
					Share Page
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={onCopy} className="flex items-center gap-1.5">
					<IoCopyOutline />
					<p>{copied ? 'Copied' : 'Copy link'}</p>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Link href={originalUrl} className="flex items-center gap-1.5">
						<FaXTwitter />
						<p>Share on Twitter/X</p>
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
