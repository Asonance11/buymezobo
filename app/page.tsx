"use client"
import MainHeader from "@/components/common/MainHeader";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/authentication";
import { InterTight } from "@/utility/fonts";
import { cn } from "@/utility/style";
import { Profile } from "@prisma/client";
import { Link, Medal } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
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

    return (
        <main className="min-h-dvh flex flex-col">
            <MainHeader />
            <section className="flex flex-col items-center justify-center grow">
                <div className="w-16 h-7 lg:w-40 lg:h-12 bg-black"></div>
                <div className="lg:w-2/3 xl:w-1/3 mx-auto p-1 lg:p-5 flex items-center justify-center flex-col gap-2 lg:gap-3 text-center">
                    <h1 className={`text-4xl md:text-6xl lg:text-8xl  dark:text-neutral-400  text-neutral-800 mb-4 lg:mb-6 text-center -tracking-wider font-bold ${InterTight.className} `}>
                        Fund your creative work
                    </h1>
                    <p className="text-sm lg:text-lg font-semibold text-gray-800" >Accept support. Start a membership. Setup a shop. It’s easier than you think.</p>
                    <Button className="p-3 lg:p-6 text-base lg:text-xl font-semibold">{profile ? "Go to dashboard" : "Start my page"}</Button>
                    <p className="text-xs lg:text-base font-light text-gray-600" >It’s free and takes less than a minute! </p>
                </div>
            </section>
            <section className="bg-green-800 flex flex-col items-center justify-center ">
            </section>

        </main>
    );
}
