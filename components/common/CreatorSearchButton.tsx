import { Profile } from '@prisma/client'
import React, { HTMLAttributes } from 'react'
import { useRouter } from "next/navigation"

interface Props extends HTMLAttributes<HTMLDivElement> {
    profile: Profile
}

export default function CreatorSearchButton({ profile, ...props }: Props) {

    const router = useRouter()

    const selectCreactor = () => {
        router.push(`/${profile.userName}`, {
        })
    }

    return (
        <div {...props} onClick={selectCreactor} onSelect={selectCreactor} className='bg-red-300 p-3 flex items-center gap-2.5 cursor-pointer'>
            <div className="cursor-pointer rounded-full w-7 h-7 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${profile?.imageUrl})` }}></div>
            <div className='flex-col gap-1 items-center justify-start'>
                <p className='text-xs font-semibold'>{profile.userName}</p>
                <p className='text-xs'>{profile.email}</p>
            </div>
        </div>
    )
}

