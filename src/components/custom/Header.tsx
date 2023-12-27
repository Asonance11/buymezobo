"use client"
import Link from "next/link";
import Menu from "./Hamburger";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation'

export interface MenuState {
    initial?: boolean | null,
    clicked?: boolean | null,
    menuName?: "close" | "menu"
}
export default function Header({ }) {

    //state for menu state
    const [menuState, setMenuState] = useState<MenuState>({
        initial: false,
        clicked: null,
        menuName: "menu"
    })

    //listen when routes change
    const pathname = usePathname()
    useEffect(() => {
        const handleRouteChange = () => {
            console.log("url changed, close the fucking menu")
            setMenuState({ clicked: false, menuName: "menu" })
        }
        handleRouteChange()
        return () => {
            handleRouteChange()
        };
    }, [pathname])

    //state for menu disabled state
    const [disabled, setDisabled] = useState(false)

    //onclick the menu button
    const handleMenu = () => {
        disableAnimation()
        if (menuState.initial === false) {
            setMenuState({
                initial: null,
                clicked: true,
                menuName: "close"
            })
            console.log(1)
        } else if (menuState.clicked === true) {
            setMenuState({
                clicked: !menuState.clicked,
                menuName: "menu"
            })
            console.log(2)
        } else if (menuState.clicked === false) {
            setMenuState({
                clicked: !menuState.clicked,
                menuName: "close"
            })
            console.log(3)
        }
    }

    // tell us if the animation should be disabled to avaoid spam
    const disableAnimation = () => {
        setDisabled(!disabled)
        setTimeout(() => {
            setDisabled(false)
        }, 1300)
    }


    return (
        <header className="z-10 w-full p-3 bg-black fixed top-0">
            <main className="z-50 flex justify-between lg:w-5/6 mx-auto bg-black p-2 px-3 rounded-lg">
                <div>
                    <Link href="/" className="-tracking-widest font-bold">playground</Link>
                </div>
                <div>
                    <button disabled={disabled} onClick={handleMenu} className="underline font-semibold -tracking-wider">{menuState.menuName}</button>
                </div>
            </main>
            <Menu state={menuState} />
        </header>
    )
}
//export default withRouter(Header)
