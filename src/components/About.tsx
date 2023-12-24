"use client"
import SplitType from 'split-type'
import { manrope } from "@/lib/fonts"
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function About() {

    const target = useRef(null)
    const trigger = useRef(null)
    useGSAP(() => {
        const animate = () => {
            const mark = {
                start: "top 60%",
                end: "top 30%"
            }
            const text = new SplitType('#target').words
            gsap.registerPlugin(ScrollTrigger)
            gsap.from(text, {
                scrollTrigger: {
                    trigger: trigger.current,
                    start: mark.start,
                    end: mark.end,
                    scrub: true,
                    markers:true 
                },
                opacity: 0.1,
                stagger: 0.1
            })
        }
        animate()
        window.addEventListener("resize", animate)
    }, { scope: target })

    return <section ref={trigger} className="w-full h-full bg-black text-white items-center grid grid-cols-1 md:grid-cols-3 px-4 md:px-5 mx-auto">
        <div className=" md:col-span-3 lg:col-span-2  flex items-center h-full">
            <p ref={target} id='target' className={`${manrope.className} text-lg`} >
                In my quest to use technology for positive change, I am driven by the idea of making a difference in the world and alleviating human suffering. I see coding as a powerful tool that can go beyond the usual limits and bring about positive transformations globally.
                I believe coding is a special gift from God almighty, a tool given to us to innovate and create, with the potential to address societal challenges, improve lives, and contribute to the greater good. With this belief, I am motivated to use technology to make a meaningful impact, pushing for progress and contributing to the betterment of humanity.
            </p>
        </div>
        <div className="hidden lg:flex col-span-1"></div>
    </section>
}
