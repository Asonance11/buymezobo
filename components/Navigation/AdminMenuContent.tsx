'use client';

import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/authentication';
import Link from 'next/link';
import { RiHomeSmileLine } from 'react-icons/ri';
import { MdOutlineExplore, MdOutlinePhotoSizeSelectActual } from 'react-icons/md';
import { PiLayout } from 'react-icons/pi';
import { PiArrowSquareOutLight } from 'react-icons/pi';
import { Logo } from '@/components/common/Logo';
import { IoSettingsOutline, IoLogOutOutline } from 'react-icons/io5';
import { BsCashStack } from 'react-icons/bs';
import { User } from 'lucia';
import { RiImageEditFill } from 'react-icons/ri';
import { IoMdNotificationsOutline } from 'react-icons/io';
import useNotificationStore from '@/store/NotificationStore';
import { InterfaceType, useInterface } from '@/store/InterfaceStore';

export default function AdminMenuContent() {
	const pathname = usePathname();

	const [profile, setProfile] = useState<User | null>(null);
	const { theresNewNotification, notifications } = useNotificationStore();
	const { onOpen } = useInterface();

	useEffect(() => {
		console.log(theresNewNotification);
		console.table(notifications);
	}, [notifications]);

	useEffect(() => {
		const fetchProfile = async () => {
			const profile = await getCurrentUser();
			setProfile(profile);
		};

		fetchProfile();
	}, []);

	if (!profile) {
		//return null; TODO: it creates a delay when we open the mobile sheet, do something
	}

	const RedirectIcon = PiArrowSquareOutLight;

	const mainOptions = [
		{ name: 'Home', route: '/dashboard', icon: RiHomeSmileLine },
		//{ name: 'Explore Creators', route: '/explore', icon: MdOutlineExplore },
		{
			name: 'View page',
			route: `/${profile?.userName}`,
			icon: PiLayout,
			newTab: true,
		},
		{
			name: 'Notifications',
			route: '',
			icon: IoMdNotificationsOutline,
			badged: theresNewNotification,
			modalType: 'notifications',
		},
		{ name: 'Gallery', route: '/gallery', icon: MdOutlinePhotoSizeSelectActual },
	];

	// Define options with categories and routes
	const categorizedOptions = [
		{
			category: 'Monetization',
			routes: [{ name: 'Payouts', route: '/payout', icon: BsCashStack }],
		},
		{
			category: 'Profile',
			routes: [
				{ name: 'Settings', route: '/settings', icon: IoSettingsOutline },
				{ name: 'Buttons & Graphics', route: '/button-and-graphics', icon: RiImageEditFill },
				{ name: 'Logout', route: '/logout', icon: IoLogOutOutline },
			],
		},
	];

	return (
		<main className="w-full h-full bg-white flex flex-col">
			<div className="h-[3rem] lg:h-[4rem] flex items-center justify-evenly">
				<Logo />
			</div>
			<section className="flex-1 p-3 ">
				{mainOptions.map((option, index) => (
					<Link
						href={option.route || ''}
						key={index}
						target={option.newTab ? '_blank' : '_self'}
						rel={option.newTab ? 'noopener noreferrer' : ''}
						className={``}
						onClick={() => {
							option.modalType ? onOpen(option.modalType as InterfaceType) : null;
						}}
					>
						<div
							className={`mb-2 flex gap-1.5 items-center justify-around transition-all duration-300 py-2.5 px-3.5 rounded-lg ${
								pathname === option.route ? 'bg-zinc-100' : 'hover:bg-zinc-100'
							}`}
						>
							<div className={` ${option.badged ? 'relative' : null} `}>
								<option.icon
									className={` ${pathname === option.route ? 'text-purple-800' : ''} text-base lg:text-2xl`}
								/>
								{option.badged && (
									<span className="absolute top-0 right-0 flex h-2.5 w-2.5">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
									</span>
								)}
							</div>{' '}
							<p className="flex-1 text-zinc-800 text-xs md:text-sm font-normal">{option.name}</p>
							{option.newTab ? <RedirectIcon className={`tex-sm lg:text-lg text-zinc-600`} /> : null}
							{option.badged ? <Badge className="flex items-center justify-center">new</Badge> : null}
						</div>
					</Link>
				))}
				{categorizedOptions.map(({ category, routes }, categoryIndex) => (
					<div key={categoryIndex} className="mt-4">
						<p className="text-xs md:text-sm font-light text-gray-500 mb-1">{category}</p>
						{routes.map((route, routeIndex) => (
							<Link key={routeIndex} href={route.route}>
								<div
									className={`mb-2 flex gap-1.5 items-center justify-around transition-all duration-300 py-2.5 px-3.5 rounded-lg ${pathname === route.route ? 'bg-zinc-100' : 'hover:bg-zinc-100'}`}
								>
									<route.icon
										className={` ${pathname === route.route ? ' text-purple-800' : null} text-base lg:text-2xl `}
									/>
									<p className="flex-1 text-zinc-800 text-xs md:text-sm font-normal">{route.name}</p>
								</div>
							</Link>
						))}
					</div>
				))}
			</section>
		</main>
	);
}
