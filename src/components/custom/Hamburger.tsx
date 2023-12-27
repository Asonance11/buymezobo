import Link from "next/link";
import { MenuState } from "./Header";
import { useEffect, useRef, useState } from "react";
import MyLink from "./CustomLink";
import gsap from "gsap";
import { fadeInUp, staggerReveal, staggerText } from "@/lib/animations";
import { manrope } from "@/lib/fonts";

interface Props {
    state: MenuState
}
export default function Menu({ state }: Props) {

    //DOm refs of animation targets.
    const menu = useRef(null)
    const revealMenu = useRef(null)
    const revealMenuBackground = useRef(null)
    const line1 = useRef(null)
    const line2 = useRef(null)
    const line3 = useRef(null)
    const info = useRef(null)

    // close or open menu logic
    const [menuVisible, setMenuVisibility] = useState(false)
    const tl = gsap.timeline({})
    const tl2 = gsap.timeline({})
    useEffect(() => {
        const menuStuff = () => {
            if (state.clicked === false) {
                //close the menu
                tl.to([revealMenu.current, revealMenuBackground.current], {
                    duration: 0.8,
                    height: 0,
                    ease: "power3.inOut",
                    stagger: {
                        amount: 0.09
                    },
                    onComplete: () => {
                        setMenuVisibility(false)
                    }

                })
                //setMenuVisibility(false)
            } else if (state.clicked === true || state.initial === null) {
                //open the menu
                tl2.to(menu.current, {
                    duration: 0,
                    onComplete: () => {
                        setMenuVisibility(true)
                    }
                })
                tl2.to([revealMenuBackground.current, revealMenu.current], {
                    duration: 0,
                    opacity: 1,
                    height: "100%",
                })
                staggerReveal(tl2, revealMenuBackground.current, revealMenu.current)
                fadeInUp(tl2, info.current)
                staggerText(tl2, line1.current, line2.current, line3.current)
                //setMenuVisibility(true)
            }
        }
        menuStuff()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])


    // a styles
    const liStyle = `text-[4rem]/none md:text-[5rem]/none lg:text-[5.9rem]/none font-extrabold -tracking-widest overflow-hidden text-black `
    const aStyle = "hover:text-black overflow-hidden"

    return (
        <section ref={menu} id="menu" className={`z-[-1] fixed top-0 bottom-0 left-0 right-0 h-full w-full ${!menuVisible ? "hidden" : ""}`}>
            <div ref={revealMenuBackground} id="menu-seconday-bg" className="z-[-1] fixed top-0 bottom-0 left-0 right-0 h-full bg-black w-full" />
            <div ref={revealMenu} id="menu-layer" className="bg-white h-full relative overflow-hidden">
                <div id="menu-free-bg" className="absolute top-0 bottom-0 left-0 right-0 h-full opacity-0" />
                <section id="menu-container" className="lg:w-2/3 mx-auto relative h-full ">
                    <div id="menu-links" className="flex justify-center items-start flex-col gap-4 lg:grid grid-cols-1 lg:grid-cols-2 lg:items-center w-full h-full px-3">
                        <nav className="">
                            <ul className="flex flex-col gap-1">
                                <li id="link" className={`${liStyle}`}><Link ref={line1} href="/about" className={`${aStyle}`}>about /</Link></li>
                                <li id="link" className={`${liStyle}`}><Link ref={line2} href="/writing" className={`${aStyle}`}>writings #</Link></li>
                                <li id="link" className={`${liStyle}`}><Link ref={line3} href="/portfolio" className={`${aStyle}`}>portfolio &#169;</Link></li>
                            </ul>
                        </nav>
                        <div ref={info} id="menu-info gap-8 flex flex-col ">
                            <p className={`font-light text-xs md:text-sm text-black ${manrope.className}`}>
                                To know more about me and what i am currently working on you can check the about page, writing has always been my way of gaining a deeper understanding, which is why you will find a collection of my thoughts on the writings page. Additionally, I enjoy expressing myself through words, so you can expect a lot of content on this page, in case you are a recruiter and want to see what i have been working on, check out the portfolio page, and pls hire me, i am currently unemployed, fun fact: I not only designed but also built this site entirely on my own – you can check out the code <a  href="https://github.com/sijirama/playground" target="_blank" className="underline font-semibold underline-offset-2">here</a>, by the way, I collaborated with Pinterest on the design. 

                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    )
}
