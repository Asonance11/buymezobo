
import { useInterface } from '@/store/InterfaceStore'
import React, { useState } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ImageUpload } from '../tools/ImageUploadButton'
import { Profile } from '@prisma/client'
import { Optional } from '@prisma/client/runtime/library'
import { updateProfile } from '@/actions/profile'
import { z } from "zod"
import { HeaderImageUpload } from '../tools/HeaderUploadButton'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from '../ui/textarea'



export default function EditUsernamePageModal() {

    const { isOpen, type, data, onClose } = useInterface()
    const open = isOpen && type === "editUsernamePage"
    const { creator } = data

    const [profileImage, setProfileImage] = useState(creator?.imageUrl)
    const [headerImage, setHeaderImage] = useState(creator?.imageUrl)

    const updateProfileImage = (image: string) => {
        setProfileImage(image)
    }

    const updateHeaderImage = (image: string) => {
        setHeaderImage(image)
    }

    const formSchema = z.object({
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        headerUrl: z.string().optional()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bio: creator?.bio || ""
        },
    })

    const onSubmitFinally = async (data: Optional<Profile>) => {
        const [profile, error] = await updateProfile(data)
        if (error) {
            return
        }
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        onSubmitFinally(values)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogDescription>
                    <p>
                        Edit {creator?.userName} page
                    </p>
                </DialogDescription>
                <div className='flex '>
                    <ImageUpload value={creator?.imageUrl} onChange={updateProfileImage} endpoint='Image' />
                    <HeaderImageUpload value={creator?.headerImageUrl!} onChange={updateHeaderImage} endpoint='Image' />
                </div>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

