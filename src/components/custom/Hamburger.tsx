import Link from "next/link";
import { MenuState } from "./Header";
import { useEffect, useState } from "react";

interface Props {
    state: MenuState
}
export default function Menu({ state }: Props) {
    const  [menuVisible , setMenuVisibility] = useState(false)

    useEffect(() => {
        const menuStuff = () => {
            if (state.clicked === false) {
                //close the menu
                setMenuVisibility(false)
            } else if (state.clicked === true || state.initial === null) {
                //open the menu
                setMenuVisibility(true)
            }
        }
        menuStuff()
    }, [state])

    const liStyle = "text-[6rem]/tight font-extrabold -tracking-widest overflow-hidden text-white"
    const aStyle = "hover:text-black"

    return (
        <section id="menu" className={`z-[-1] fixed top-0 bottom-0 left-0 right-0 h-full bg-red-700 w-full ${!menuVisible ? "hidden" : ""}`}>
            <div id="menu-seconday-bg" className="z-[-1] fixed top-0 bottom-0 left-0 right-0 h-full bg-black w-full" />
            <div id="menu-layer" className="bg-red-900 h-full relative overflow-hidden">
                <div id="menu-free-bg" className="absolute top-0 bottom-0 left-0 right-0 h-full opacity-0" />
                <section id="menu-container" className="lg:w-2/3 mx-auto relative h-full ">
                    <div id="menu-links" className="grid grid-cols-1 lg:grid-cols-2 items-center w-full h-full px-5">
                        <nav className="">
                            <ul className="flex flex-col gap-1">
                                <li className={`${liStyle}`}><Link href="/about" className={`${aStyle}`}>About</Link></li>
                                <li className={`${liStyle}`}><Link href="/solution" className={`${aStyle}`}>Solution</Link></li>
                                <li className={`${liStyle}`}><Link href="/contact" className={`${aStyle}`}>Contact</Link></li>
                            </ul>
                        </nav>
                        <div id="menu-info ">
                            <h3 className="font-bold -tracking-wider text-white">Oluwasijibomi</h3>
                            <p className="font-light text-sm text-white">On behalf of the welfare of all mankind, I aspire to utilize my skills as a software developer to create solutions that transcend boundaries and uplift humanity. By crafting accessible applications, addressing global challenges, and fostering collaboration, I aim to contribute to a world where technology enhances lives and leaves no one behind. Together, let's code a better future for everyone.</p>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    )
}
