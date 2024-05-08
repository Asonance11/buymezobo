"use client"
import UserNameHeader from "@/components/common/UsernameHeader"
import { getCreatorByName } from "@/lib/creator"
import { Profile } from "@prisma/client"
import { useEffect, useState } from "react"
import BuyCard from "./_components/BuyCard"
import SupportersCard from "./_components/SupportersCard"

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

    return (
        <main className="min-h-screen bg-red-700 flex flex-col ">
            <UserNameHeader className="" user={creator} />
            <section className="flex-1 bg-blue-700 w-full flex flex-col space-y-5 ">
                <div className="w-full h-64 bg-pink-500"></div>
                <div className="flex-1 bg-green-600 flex flex-col lg:flex-row justify-center gap-3 relative items-center lg:items-start">
                    <div className="bg-black w-[33rem] h-96 md:-mt-20 lg:-mt-32"></div>
                    <div className="bg-black w-[33rem] h-96 md:-mt-20 lg:-mt-32"></div>
                </div>
            </section>
        </main>
    )
}
