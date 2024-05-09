
import { Profile } from '@prisma/client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { Checkbox } from '@/components/ui/checkbox'
import ZoboAmountPicker from '@/components/tools/ZoboAmountPicker'


interface Props {
    creator: Profile
}
export default function BuyCard({ creator }: Props) {

    const [loading, setLoading] = useState(false)
    const [amountToPay, setAmountToPay] = useState(0)


    const formSchema = z.object({
        name: z.string(),
        content: z.string(),
        privateMessage: z.boolean().default(false).optional(),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }




    return (
        <div className='p-5 w-[33rem] rounded-xl bg-white flex flex-col gap-3 items-start h-fit'>
            <div>Buy {creator.userName} Zobo</div>
            <ZoboAmountPicker setAmount={setAmountToPay} amount={amountToPay} creator={creator} />
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3 w-full'>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input className='w-full resize-none' {...field} placeholder='Name or alias' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea className='w-full resize-none' {...field} placeholder='Say something nice' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="privateMessage"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Make this message a private message
                                    </FormLabel>
                                    <FormDescription>
                                        The message will be visible to you and the creator only
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button disabled={loading} className='w-full' type="submit">Support N{amountToPay}</Button>
                </form>
            </Form>

        </div>
    )
}

