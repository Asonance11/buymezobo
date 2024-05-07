import { getCurrentUser } from '@/lib/authentication'
import React from 'react'

export default async function page() {
    const profile = await getCurrentUser()
    return (
        <div>Welcome `${profile?.userName}`</div>
    )
}

