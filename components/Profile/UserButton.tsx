'use client';

// Importing necessary modules and components
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth as Auth } from '@/actions/use-auth';
import { signOut } from '@/actions/signout';
import SharePage from './SharePage';
import { avatarImageUrl } from '@/utility/avatar';
import { useUser } from '@/store/UserDataStore';
import { Profile } from '@prisma/client';
import { FaHome, FaUserEdit, FaUserCircle, FaCog, FaShareAlt, FaSignOutAlt } from 'react-icons/fa'; // Importing icons from react-icons
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { truncateText } from '@/utility/text';
import { useInterface } from '@/store/InterfaceStore';
import { FaAnchor } from 'react-icons/fa6';

// Functional component definition
const UserButton: React.FC = () => {
	// Destructuring necessary values and methods from useUser hook
	const { loggedInUser, updateUser, logOut } = useUser();
	const { onOpen } = useInterface();

	// Effect hook to fetch profile data if user is not logged in
	useEffect(() => {
		const fetchProfile = async () => {
			if (!loggedInUser) {
				const { user } = await Auth();
				updateUser(user);
			}
		};
		fetchProfile();
	}, []);

	// Function to handle sign out
	const handleSignOut = async () => {
		logOut();
		signOut();
	};

	// Return statement for rendering the user button and dropdown content
	return (
		<DropdownMenu>
			{loggedInUser && (
				<>
					{/* DropdownMenuTrigger for displaying user avatar */}
					<DropdownMenuTrigger className="border-none outline-none flex items-center">
						{/* Conditional rendering of user avatar */}
						{loggedInUser!.imageUrl ? (
							<div
								className="cursor-pointer rounded-full w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
								style={{ backgroundImage: `url(${loggedInUser!.imageUrl})` }}
							></div>
						) : (
							<img
								className="cursor-pointer rounded-full w-10 lg:w-12 h-10 lg:h-12 bg-center bg-cover bg-no-repeat border-1 border-purple-300"
								src={avatarImageUrl(loggedInUser as Profile)}
								alt="avatar"
							/>
						)}
					</DropdownMenuTrigger>

					{/* DropdownMenuContent for dropdown items */}
					<DropdownMenuContent>
						<div className="p-4 flex flex-col items-center justify-center">
							<p className="text-sm">My Account</p>
							<p className="text-xs">{loggedInUser.email ? truncateText(loggedInUser.email!, 23) : ''}</p>
						</div>
						{/* Dropdown menu items */}
						<DropdownMenuSeparator />
						<Link href="/dashboard">
							<DropdownMenuItem>
								<FaHome className="mr-2" size={16} /> Dashboard
							</DropdownMenuItem>
						</Link>
						<DropdownMenuItem className="lg:hidden">
							<FaUserEdit className="mr-2" size={16} /> Edit my page
						</DropdownMenuItem>
						<Link href={`/${loggedInUser!.userName}`}>
							<DropdownMenuItem>
								<FaUserCircle className="mr-2" size={16} /> View my page
							</DropdownMenuItem>
						</Link>
						<Link href="/settings">
							<DropdownMenuItem>
								<FaCog className="mr-2" size={16} /> Settings
							</DropdownMenuItem>
						</Link>
						<DropdownMenuItem onClick={() => onOpen("feedbackFormModal")}>
							<FaAnchor className="mr-2" size={16} /> Provide Feedback
						</DropdownMenuItem>

						<DropdownMenuItem className="hidden">
							<FaShareAlt className="mr-2" size={16} />
							<SharePage className="text-xs hidden" profile={loggedInUser!} />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleSignOut}>
							<FaSignOutAlt className="mr-2" size={16} /> Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</>
			)}
		</DropdownMenu>
	);
};

// Exporting the UserButton component
export default UserButton;
