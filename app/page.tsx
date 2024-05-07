"use client"
import SignOut from "@/components/signout";
import { Button } from "@/components/ui/button";
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
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

            buy me zobo again

            {
                profile ? <SignOut />: <Button onClick={signIn}>Sign In</Button>
            }

            <Button onClick={alertt}>Click me</Button>
        </main>
    );
}
