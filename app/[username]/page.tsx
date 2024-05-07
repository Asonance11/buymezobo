"use client"
import UserNameHeader from "@/components/common/UsernameHeader"
import { getCreatorByName } from "@/lib/creator"
import { Profile } from "@prisma/client"
import { useEffect, useState } from "react"

export default function Page(props: any) {
    const creatorname = props.params.username

    const [creator, setCreator] = useState<Profile | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const creator = await getCreatorByName(creatorname)
            setCreator(creator)
        }
        getUser()
    }, [])

    if (!creator) {
        return null
    }

    return <main>
        <UserNameHeader user={creator} />
        <p>Hello world {creator?.userName}</p>
    </main>
}
