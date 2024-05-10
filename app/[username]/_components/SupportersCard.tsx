
import { getCreatorSupports } from '@/actions/support'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utility/style'
import { Profile, Support } from '@prisma/client'
import React, { HTMLAttributes, useEffect, useState } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
    creator: Profile
}

export default function SupportersCard({ creator, className }: Props) {

    const [supports, setSupports] = useState<Support[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getSupports = async () => {
            setLoading(true)
            const [supports, error] = await getCreatorSupports(creator.id)
            if (error != null) {
                console.error(error)
                //TODO: handle error
                setLoading(false)
                return
            }
            console.log(supports)
            setSupports(supports)
            setLoading(false)
        }
        getSupports()
    }, [])

    return (
        <div className={cn(` p-10 w-[33rem] rounded-2xl bg-white flex flex-col gap-3 items-start h-fit`, className)}>
            <div className='space-y-3'>
                <p className='text-lg font-bold -tracking-wide'>About {creator.userName}</p>
                <p className='text-sm font-semibold text-zinc-500'>{creator.bio}</p>
            </div>
            <Separator className='my-2' />
            <div className='spce-y-4 w-full'>
                {
                    supports.map((support) => (
                        <div key={support.id} className='py-3 w-full '>
                            <div className="lg:flex items-center gap-3 ">
                                <div className="cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat bg-black "></div>
                                <div className='flex-col space-y-1.5 items-center justify-start'>
                                    <div>
                                        <p className='text-sm '>
                                            <span className='font-semibold'>
                                                {support.name}
                                            </span>
                                            {" "}bought {support.numberOfZobo} zobos </p>
                                    </div>
                                    {
                                        support.content ? (
                                            <div className='p-2 bg-slate-200 rounded-lg flex items-center justify-start'>
                                                <p className='text-sm'>{support.content}</p>
                                            </div>
                                        ) : (null)
                                    }
                                </div>
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

