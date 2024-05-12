import { cn } from '@/utility/style'
import { Profile } from '@prisma/client'
import React, { HTMLAttributes } from 'react'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { MdIosShare } from "react-icons/md";
import SharePage from '../common/SharePage'
import { formatNumberWithCommas } from '@/utility/text'

interface Props extends HTMLAttributes<HTMLDivElement> {
    profile: Profile
}

export default function DashBoardEarningPage({ profile, className }: Props) {

    const nairaSymbol = "₦"
    return (
        <div className={cn(`py-6 px-5 rounded-lg bg-white`, className)}>
            <div className='flex items-center gap-2'>
                <div className="cursor-pointer rounded-lg w-10 h-10 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${profile?.imageUrl})` }}></div>
                <div className='flex-1'>
                    <p className='text-xl font-semibold tracking-tight'>Hi, {profile.firstName || profile.userName }</p>
                    <p className='font-light text-sm text-zinc-700'>buymezobo.com/{profile.userName}</p>
                </div>
                <SharePage profile={profile} />
            </div>
            <Separator className='my-6' />
            <div className='flex flex-col justify-center items-start gap-2'>
                <div className='flex items-center justify-start gap-3'>
                    <p>Earning</p>
                    <div className='w-20 h-7 bg-black'></div>
                </div>
                <p className='text-5xl font-bold'>
                    {nairaSymbol}{formatNumberWithCommas(profile.balance)}
                </p>
            </div>

        </div>
    )
}

