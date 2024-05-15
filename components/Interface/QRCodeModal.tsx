import { useInterface } from '@/store/InterfaceStore';
import React from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { getCurrentUser } from '@/lib/authentication';
import { QRMaker } from '../tools/QRMaker';
import { Button } from '../ui/button';

export default function QRCodeModal() {
	const { type, isOpen, onClose } = useInterface();
	const open = isOpen && type == 'QRCodeModal';

	const downloadQr = () => {
		getCurrentUser().then((user) => {
			const canvas = document.querySelector('canvas') as HTMLCanvasElement;
			const a = document.createElement('a');
			a.href = canvas.toDataURL('image/png');
			a.download = `${user?.userName}-qr.png`;
			a.click();
		});
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="flex flex-col items-center justify-center">
				<QRMaker />
				<DialogFooter className="flex items-center gap-4">
					<Button variant={'secondary'} className="font-semibold" onClick={onClose}>
						Cancel
					</Button>
					<Button className="font-semibold" onClick={downloadQr}>
						Download
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
