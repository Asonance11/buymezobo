
import { Profile } from '@prisma/client'
import React from 'react'

interface Props {
    creator: Profile
}
export default function BuyCard({ creator }: Props) {
    return (
        <div className='p-5 rounded-xl bg-purple-200 flex flex-col gap-3 items-center h-fit'>
            <div>Buy {creator.userName} Zobo</div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

