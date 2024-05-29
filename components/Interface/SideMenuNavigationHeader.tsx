import { FaQuoteLeft } from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useInterface } from '@/store/InterfaceStore';
import { IoMdSearch } from 'react-icons/io';
import { Logo } from '../common/Logo';
import { Button } from '../ui/button';
import Link from 'next/link';
import UserButton from '../common/UserButton';
import { useEffect, useRef } from 'react';

export function SideMenuNavigationComponent() {
	const { onOpen, type, isOpen, onClose, data } = useInterface();
	const open = type == 'sideMenuNavigation' && isOpen;
	const { creator } = data;

	const inputRef = useRef<HTMLInputElement>(null);

	const openMenu = () => {
		onOpen('searchCreators');
	};

	useEffect(() => {
		if (open) {
			const blurTimeout = setTimeout(() => {
				inputRef?.current?.blur();
			}, 0);

			return () => clearTimeout(blurTimeout);
		}
	}, [open]);

	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent side={'left'} className="overflow-y-auto px-3 py-0">
				<aside className="flex gap-6 flex-col w-full h-screen px-0 py-4 overflow-y-auto bg-white dark:bg-gray-900 ">
					<a href="#">
						<Logo />
					</a>

					<div className="flex flex-col justify-between flex-1 ">
						<nav className="flex-1 space-y-3 ">
							{/*
							 */}
							<div
								onClick={openMenu}
								className="flex gap-1 items-center justify-start p-2 rounded-lg bg-zinc-100 "
							>
								<IoMdSearch className="text-xl" />
								<input
									ref={inputRef}
									onClick={openMenu}
									type="text"
									placeholder="Search Creators"
									className="focus:outline-none flex-1 bg-transparent text-sm font-semibold placeholder-zinc-700"
								/>
							</div>

							<a
								className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
								href="/faq"
							>
								<FaQuoteLeft />
								<span className="mx-2 text-sm font-medium">FAQ</span>
							</a>

							<a
								className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
								href="/about"
							>
								<IoInformationCircle className="" />
								<span className="mx-2 text-sm font-medium">About</span>
							</a>

							{creator != null ? null : (
								<div className="flex items-center gap-2">
									<Button className="block rounded-lg text-sm lg:text-base font-semibold tracking-tight flex-1 w-full">
										<a href="/signup">Create my Page</a>
									</Button>
								</div>
							)}
						</nav>
					</div>
				</aside>
			</SheetContent>
		</Sheet>
	);
}
