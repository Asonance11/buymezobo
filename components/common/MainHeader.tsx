import { useInterface } from "@/store/InterfaceStore"
import React from 'react'
import { IoMdSearch } from "react-icons/io";

export default function MainHeader() {
    const { onOpen } = useInterface()

    const openMenu = () => {
        onOpen("searchCreators")
    }

    return (
        <div className="navbar bg-white  lg:max-w-[95%] mx-auto">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>Homepage</a></li>
                        <li><a>Portfolio</a></li>
                        <li><a>About</a></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost text-xl">BuyMeZobo</a>
            </div>
            <div className="navbar-end flex gap-3">
                <div onClick={openMenu} className='hidden lg:flex gap-1 items-center justify-start p-2 rounded-lg bg-zinc-200 '>
                    <IoMdSearch className="text-xl" />
                    <input onClick={openMenu} type='text' placeholder='Search Creators' className='focus:outline-none flex-1 bg-transparent text-sm font-semibold placeholder-zinc-700' />
                </div>
                <button>Login</button>
                <button>Sign up</button>
            </div>
        </div>
    )

}

