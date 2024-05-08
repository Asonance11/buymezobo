
import { useInterface } from '@/store/InterfaceStore'
import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export default function EditUsernamePageModal() {

    const { isOpen, type, data, onClose } = useInterface()
    const open = isOpen && type === "editUsernamePage"
    const { creator } = data

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogDescription>
                    <p>
                        Edit {creator?.userName} page
                    </p>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

