import { useInterface } from '@/store/InterfaceStore';
import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function PayoutInfoModal() {
    const { type, isOpen, onClose, data } = useInterface();
    const open = isOpen && type == 'payoutInfoModal';

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Payout info for {data.creator?.userName}?</DialogTitle>
                    <DialogDescription>
                        To enable payouts, you'll need to provide your bank details to our payment partner. Rest
                        assured, your information is secure and will be encrypted on our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
