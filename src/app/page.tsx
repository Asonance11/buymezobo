"use client"
import Cursor from "@/components/custom/CustomCursor"
import { manrope } from "@/lib/fonts"
import gsap from "gsap"
import { useEffect, useRef } from "react"
import { useGSAP } from "@gsap/react"

export default function Home() {
    const title = useRef(null)
    const title2 = useRef(null)
    useGSAP(() => {
        const tl = gsap.timeline({})
        tl.from([title.current , title2.current], {
            y: 100,
            opacity:0,
            duration:1,
            ease:"power3.inOut",
            stagger:{
                amount:0.1
            }
        })
    },{scope:title})
    return (
        <main className="min-h-screen w-screen px-5 items-center py-5 lg:pt-16 flex justify-center text-center overflow-hidden bg-white text-black">

            <div className="w-full h-full fixed bg-red-500 -z-10 bg-transparent" >
            </div>

            <h1 ref={title} className={`overflow-hidden text-6xl/none md:text-7xl/none lg:text-[10rem]/none font-bold -tracking-widest ${manrope.className}`}>
                Oluwasijibomi{" "}
                <span ref={title2} className="block">Ilesanmi</span>
            </h1>
        </main>
    )
}
