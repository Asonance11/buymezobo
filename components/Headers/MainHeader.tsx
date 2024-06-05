import { useInterface } from '@/store/InterfaceStore';
import React, { useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { Button } from '../ui/button';
import useIsMobile from '@/hooks/useIsMobile';
import { HiMenu } from 'react-icons/hi';
import { Logo } from '../common/Logo';
import Link from 'next/link';
import { useUser } from '@/store/UserDataStore';
import { useAuth as Auth } from '@/actions/use-auth';
import UserButton from '../Profile/UserButton';
import { helvetica } from '@/utility/fonts';

const MenuLinks = () => (
	<>
		<Link
			prefetch={false}
			href="/faq"
			className={`text-lg ${helvetica.className} font-light tracking-tight hover:underline`}
		>
			FAQs
		</Link>
		<Link
			prefetch={false}
			href="/about"
			className={`text-lg ${helvetica.className} font-light tracking-tight hover:underline`}
		>
			About Us
		</Link>
	</>
);

export default function MainHeader() {
	const { onOpen } = useInterface();
	const isMobile = useIsMobile();
	const { loggedInUser, updateUser } = useUser();
	const [loading, setLoading] = useState(!loggedInUser);

	useEffect(() => {
		if (loggedInUser) {
			setLoading(false);
		}
	}, [loggedInUser]);

	const openMenu = () => onOpen('searchCreators');
	const openSide = () => onOpen('sideMenuNavigation', { creator: loggedInUser });

	return (
		<div className="navbar bg-white lg:max-w-[95%] mx-auto">
			<div className="navbar-start">
				{isMobile ? (
					<HiMenu className="text-2xl" onClick={openSide} />
				) : (
					<div className="hidden md:flex items-center gap-5">
						<MenuLinks />
					</div>
				)}
			</div>
			<div className="navbar-center">
				<Logo textClassName="text-lg" />
			</div>
			<div className="navbar-end flex items-center gap-3">
				{!isMobile && (
					<div
						onClick={openMenu}
						className="hidden xl:flex gap-1 items-center justify-start p-2 rounded-lg bg-zinc-100"
					>
						<IoMdSearch className="text-xl" />
						<input
							onClick={openMenu}
							type="text"
							placeholder="Search Creators"
							className="focus:outline-none flex-1 bg-transparent text-sm font-semibold placeholder-zinc-700"
						/>
					</div>
				)}
				{loading && !isMobile ? (
					<div className="hidden lg:flex gap-3">
						<div className="bg-purple-300 h-[40px] w-[100px] p-2 rounded-lg animate-pulse" />
						<div className="rounded-full w-[40px] h-[40px] p-2 bg-sky-200 animate-pulse" />
					</div>
				) : loggedInUser ? (
					<>
						{!isMobile && (
							<Link href="/dashboard">
								<Button className="font-bold">Dashboard</Button>
							</Link>
						)}
						<UserButton />
					</>
				) : (
					<>
						{!isMobile && (
							<>
								<Button
									variant="secondary"
									className="text-sm lg:text-base font-semibold tracking-tight"
								>
									<a href="/signin">Login</a>
								</Button>
								<Button className="rounded-lg text-sm lg:text-base font-semibold tracking-tight">
									<a href="/signup">Sign up</a>
								</Button>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
