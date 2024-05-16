import React, { useState } from 'react';
import UserButton from './UserButton';
import useIsMobile from '@/hooks/useIsMobile';
import { HiMenu } from 'react-icons/hi';
import { useInterface } from '@/store/InterfaceStore';
import { User } from 'lucia';

export default function AdminHeader() {
	const { onOpen } = useInterface();
	const [profile, setProfile] = useState<User | null>(null);
	const isMobile = useIsMobile();
	const openSide = () => {
		onOpen('sideMenuNavigation');
	};
	return (
		<div className="w-full bg-red-50 h-[3rem] lg:h-[4rem] lg:px-12 shadow-sm flex items-center justify-end">
			{isMobile ? (
				<div className="navbar px-2">
					<div className="navbar-start ">
						<HiMenu className="text-2xl" onClick={openSide} />
					</div>
					<div className="navbar-end flex">
						<UserButton />
					</div>
				</div>
			) : (
				<div className="navbar-end flex md:mr-2">
					<UserButton />
				</div>
			)}
		</div>
	);
}
