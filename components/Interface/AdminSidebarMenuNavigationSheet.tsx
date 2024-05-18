import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useInterface } from '@/store/InterfaceStore';
import AdminMenuContent from '../AdminMenuContent';

export function AdminSideMenuNavigationComponent() {
	const { type, isOpen, onClose, data } = useInterface();
	const open = type == 'adminSideMenuNavigation' && isOpen;
	const { creator } = data;

	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent side={'left'} className="p-1">
				<AdminMenuContent />
			</SheetContent>
		</Sheet>
	);
}
