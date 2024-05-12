import { FaQuoteLeft } from 'react-icons/fa';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useInterface } from '@/store/InterfaceStore';
import { IoMdSearch } from 'react-icons/io';
import SideBarCard from './SideBarCard';
import { Logo } from '../common/Logo';

export function SideMenuNavigationComponent() {
	const { onOpen, type, isOpen, onClose } = useInterface();
	const open = type == 'sideMenuNavigation' && isOpen;

	const openMenu = () => {
		onOpen('searchCreators');
	};
	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent side={'left'} className="overflow-y-auto px-3 py-0">
				<SheetHeader>
					<SheetTitle></SheetTitle>
				</SheetHeader>
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
						</nav>
					</div>
				</aside>
			</SheetContent>
		</Sheet>
	);
}
