"use client"
import SplitType from 'split-type'
import { manrope } from "@/lib/fonts"
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useScreenSize from './hooks/useScreenSize'

export default function About() {
    //const screen  = useScreenSize()
    const target = useRef(null)
    useGSAP(() => {
        const animate = () => {
            const text = new SplitType('#target').words
            gsap.registerPlugin(ScrollTrigger)
            gsap.from(text, {
                scrollTrigger: {
                    trigger: target.current,
                    start: "top 75%",
                    end: "top 30%",
                    scrub: true,
                    markers: false
                },
                opacity: 0.1,
                stagger: 0.1
            })
        }
        animate()
        window.addEventListener("resize",animate)
    }, { scope: target })

    return <section className="w-full h-full bg-black text-white items-center grid grid-cols-1 md:grid-cols-3 px-4 md:px-5 mx-auto">
        <div className=" md:col-span-3 lg:col-span-2  flex items-center h-full">
            <p ref={target} id='target' className={`${manrope.className} text-lg`} >
            In my quest to use technology for positive change, I am driven by the idea of making a difference in the world and alleviating human suffering. I see coding as a powerful tool that can go beyond the usual limits and bring about positive transformations globally.
I believe coding is a special gift from God almighty, a tool given to us to innovate and create, with the potential to address societal challenges, improve lives, and contribute to the greater good. With this belief, I am motivated to use technology to make a meaningful impact, pushing for progress and contributing to the betterment of humanity.
            </p>
        </div>
        <div className="hidden lg:flex col-span-1"></div>
    </section>
}
