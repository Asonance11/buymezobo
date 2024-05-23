import { useInterface } from '@/store/InterfaceStore';
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function PopUpWidgetModal() {
	const { isOpen, onClose, type, data } = useInterface();

	const open = isOpen && type == 'popupWidgetModal';

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="flex flex-col items-center justify-center p-0 w-fit"></DialogContent>
		</Dialog>
	);
}
