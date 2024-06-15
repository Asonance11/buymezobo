import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Draggable from 'react-draggable';
import { useInterface } from '@/store/InterfaceStore';
import BuyCard from '@/app/(public)/[username]/_components/BuyCard';
import { MdCancel, MdFullscreenExit, MdImportExport } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MdMinimize } from 'react-icons/md';
import TooltipPrimitive from '../ui/tooltipPrimitive';

export default function SupportWindow() {
	const { type, data, isOpen, onClose } = useInterface();
	const open = isOpen && type == 'supportwindow';
	const { creator } = data;
	const router = useRouter();
	const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: 0 });
	const [minimized, setMinimized] = useState(false);

	const handleMinimize = () => {
		setMinimized(!minimized);
	};

	useEffect(() => {
		const handleResize = () => {
			const centerX = window.innerWidth / 2 - 200; // Assuming modal width is 400px / 2
			const centerY = window.innerHeight / 2 - 200; // Assuming modal height is 400px / 2
			setDefaultPosition({ x: centerX, y: centerY });
		};

		handleResize(); // Initial center position
		window.addEventListener('resize', handleResize); // Re-center on window resize

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	if (!creator) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<Draggable handle=".handle" axis="both" defaultPosition={{ x: 0, y: 0 }}>
				<DialogContent className="w-fit max-w-[4000rem] p-0 ">
					<DialogHeader className="handle bg-purple-300 text-black p-2 cursor-grab rounded-t-lg min-w-72">
						<div></div>
						<div className="flex items-center justify-end gap-1 text-2xl ">
							<TooltipPrimitive prompt="minimize window">
								<MdMinimize className="cursor-pointer" onClick={handleMinimize} />
							</TooltipPrimitive>

							<TooltipPrimitive prompt="go to full screen">
								<MdFullscreenExit
									className="cursor-pointer"
									onClick={() => router.push(`/${creator.userName}`)}
								/>
							</TooltipPrimitive>
							<TooltipPrimitive prompt="close window">
								<MdCancel className="cursor-pointer" onClick={onClose} />
							</TooltipPrimitive>
						</div>
					</DialogHeader>
					{minimized ? null : (
						<section className={` transition-transform duration-150 ${minimized ?? 'hidden'} `}>
							<BuyCard creator={creator} />
						</section>
					)}
				</DialogContent>
			</Draggable>
		</Dialog>
	);
}
