'use client';
import React, { useEffect, useState } from 'react';
import { HTMLAttributes } from 'react';
import { Button } from '../ui/button';
import { getCurrentUser } from '@/lib/authentication';
import { cn } from '@/utility/style';
import { truncateText } from '@/utility/text';
import { Logo } from '@/components/common/Logo';
import UserButton from '../Profile/UserButton';
import { FaEdit } from 'react-icons/fa'; // Importing icons from react-icons
import { User } from 'lucia';
import { avatarImageUrl } from '@/utility/avatar';
import { Profile } from '@prisma/client';
import { useInterface } from '@/store/InterfaceStore';
import { FaUserPlus } from 'react-icons/fa6';
interface Props extends HTMLAttributes<HTMLDivElement> {
	user: User;
}

//WARN: visitedUser is the page we are visiting, loggedInUser is the loggedin user
//TODO: make better naming conventions

export default function UserNameHeader({ user: visitedUser, className, ...props }: Props) {
	const { onOpen } = useInterface();
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			const loggedInUser = await getCurrentUser();
			setLoggedInUser(loggedInUser);
		};
		fetchProfile();
	}, []);

	const openEditPage = () => {
		onOpen('editUsernamePage', { creator: loggedInUser });
	};

	const openMenu = () => {
		onOpen('searchCreators');
	};

	return (
		<div {...props} className={cn('w-full bg-white', className)}>
			<div className="navbar bg-white  lg:max-w-[95%] mx-auto">
				<div className="navbar-start lg:flex items-center gap-3">
					<div
						className="cursor-pointer hidden lg:block rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat border-[0.5px] border-purple-300"
						style={{
							backgroundImage: `url(${avatarImageUrl(visitedUser as Profile)})`,
						}}
					></div>
					<div className="flex-col gap-1  hidden lg:block items-center justify-start">
						<p className="text-xs font-semibold">{visitedUser.userName}</p>
						<p className="text-xs">{truncateText(visitedUser?.bio || visitedUser.email, 35)}</p>
					</div>
				</div>
				<div className="navbar-center flex">
					<Logo className=" hidden lg:block " />
				</div>
				<div className="navbar-end flex gap-2">
					<div className="flex items-center gap-5">
						{loggedInUser?.id === visitedUser.id && (
							<Button className="hidden lg:flex" onClick={openEditPage}>
								<FaEdit className="mr-1" /> Edit Page
							</Button>
						)}{' '}
					</div>
					{loggedInUser ? (
						<UserButton />
					) : (
						<>
							<Button variant={"outline"} className="rounded-lg text-sm lg:text-base font-semibold tracking-tight">
								<FaUserPlus className="mr-1" />
								<a href="/signup">Get Started</a>
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
