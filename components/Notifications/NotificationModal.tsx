import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

import { useInterface } from '@/store/InterfaceStore';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '../ui/button';
import { NotificactionCore } from './NotificactionCore';

export default function NotificationModal() {
    const { isOpen, type, onClose } = useInterface();
    const open = isOpen && type == 'notifications';
    const isDesktop = useMediaQuery('(min-width: 768px)');


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <NotificactionCore open={open} />
            </DialogContent>
        </Dialog>
    );
    if (isDesktop) {
    }

    // return (
    // 	<Drawer open={open && !isDesktop} onOpenChange={onClose}>
    // 		<DrawerContent>
    // 			<DrawerHeader>
    // 				<DrawerTitle>Are you absolutely sure?</DrawerTitle>
    // 				<DrawerDescription>This action cannot be undone.</DrawerDescription>
    // 			</DrawerHeader>
    // 			<DrawerFooter>
    // 				<Button>Submit</Button>
    // 				<DrawerClose>
    // 					<Button variant="outline">Cancel</Button>
    // 				</DrawerClose>
    // 			</DrawerFooter>
    // 		</DrawerContent>
    // 	</Drawer>
    // );
}
