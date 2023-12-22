import Link from "next/link";
import { MenuState } from "./Header";
import { useEffect, useRef, useState } from "react";
import MyLink from "./CustomLink";
import gsap from "gsap";
import { fadeInUp, staggerReveal, staggerText } from "@/lib/animations";

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
    const liStyle = "text-[4rem]/none lg:text-[6rem]/none font-extrabold -tracking-widest overflow-hidden text-white"
    const aStyle = "hover:text-black"

    return (
        <section ref={menu} id="menu" className={`z-[-1] fixed top-0 bottom-0 left-0 right-0 h-full w-full ${!menuVisible ? "hidden" : ""}`}>
            <div ref={revealMenuBackground} id="menu-seconday-bg" className="z-[-1] fixed top-0 bottom-0 left-0 right-0 h-full bg-purple-700 w-full" />
            <div ref={revealMenu} id="menu-layer" className="bg-red-900 h-full relative overflow-hidden">
                <div id="menu-free-bg" className="absolute top-0 bottom-0 left-0 right-0 h-full opacity-0" />
                <section id="menu-container" className="lg:w-2/3 mx-auto relative h-full ">
                    <div id="menu-links" className="flex justify-center items-start flex-col gap-4 lg:grid grid-cols-1 lg:grid-cols-2 lg:items-center w-full h-full px-3">
                        <nav className="">
                            <ul className="flex flex-col gap-1">
                                <li id="link" className={`${liStyle}`}><Link ref={line1} href="/about" className={`${aStyle}`}>About</Link></li>
                                <li id="link" className={`${liStyle}`}><Link ref={line2} href="/solution" className={`${aStyle}`}>Solution</Link></li>
                                <li id="link" className={`${liStyle}`}><Link ref={line3} href="/contact" className={`${aStyle}`}>Contact</Link></li>
                            </ul>
                        </nav>
                        <div ref={info} id="menu-info gap-8 flex flex-col ">
                            <h3 className="font-bold -tracking-wider text-white">Oluwasijibomi</h3>
                            <p className="font-light text-sm text-white">On behalf of the welfare of all mankind, I aspire to utilize my skills as a software developer to create solutions that transcend boundaries and uplift humanity. I aim to contribute to a world where technology enhances lives and leaves no one behind. Together, let us code a better future for everyone.</p>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    )
}
