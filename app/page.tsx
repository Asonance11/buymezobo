"use client"
import MainHeader from "@/components/common/MainHeader";
import { getCurrentUser } from "@/lib/authentication";
import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await getCurrentUser()
            setProfile(profile)
        }
        fetchProfile()
    }, [])

    if (profile) {
        //redirect(`/dashboard`)
    }

    const signIn = () => {
        router.push(`/signin`)
    }

    const alertt = () => {
        alert(profile)
    }

    return (
        <main className="min-h-screen">
            <MainHeader />
        </main>
    );
}
