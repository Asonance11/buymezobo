'use client';
import React from 'react';
import { useEffect, useState } from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { truncateText } from '@/utility/text';
import Link from 'next/link';
import { useAuth as Auth } from '@/actions/use-auth';
import { signOut } from '@/actions/signout';
import SharePage from './SharePage';
import { avatarImageUrl } from '@/utility/avatar';
import { useUser } from '@/store/UserDataStore';

export default function UserButton() {
	const { loggedInUser, updateUser, logOut } = useUser();

	useEffect(() => {
		const fetchProfile = async () => {
			if (!loggedInUser) {
				const profile = await Auth();
				updateUser(profile);
			}
			console.log('pic, ', loggedInUser);
		};
		fetchProfile();
	}, []);

	const OnSignOut = async () => {
		logOut();
		signOut();
	};

	/*
<div className="text-xl font-extrabold text-purple-900 bg-purple-100 cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat border-[0.5px] border-purple-300 flex justify-center items-center">
                        <p className="text-center">{(profile?.firstName as string)[0]}</p>
                    </div>

        */

	return (
		<DropdownMenu>
			{loggedInUser && (
				<>
					<DropdownMenuTrigger className="border-none outline-none">
						{loggedInUser!.imageUrl ? (
							<div
								className="cursor-pointer rounded-lg w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
								style={{ backgroundImage: `url(${loggedInUser!.imageUrl})` }}
							></div>
						) : (
							<img
								className="cursor-pointer rounded-lg w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
								src={avatarImageUrl(loggedInUser!.firstName!)}
								alt="avatar"
							/>
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<div className="p-4 flex flex-col items-center justify-center">
							<p className="text-sm">My Account</p>
							<p className="text-xs">{loggedInUser.email ? truncateText(loggedInUser.email!, 23) : ''}</p>
						</div>
						<DropdownMenuSeparator />
						<Link href={'/dashboard'}>
							<DropdownMenuItem>Dashboard</DropdownMenuItem>
						</Link>
						<DropdownMenuItem className="lg:hidden">Edit my page</DropdownMenuItem>
						<Link href={`/${loggedInUser!.userName}`}>
							<DropdownMenuItem>View my page</DropdownMenuItem>
						</Link>
						<DropdownMenuItem>
							<SharePage className="text-xs hidden" profile={loggedInUser!} />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={OnSignOut}>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</>
			)}
		</DropdownMenu>
	);
}
