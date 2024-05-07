import { FaWineBottle } from "react-icons/fa6";
import React from 'react'

export const Logo = ({}) => {
    return (
        <div className="flex items-center justify-center gap-0.5">
            <FaWineBottle className="text-2xl text-purple-950 "/>
            <p className="text-xl tracking-tight font-bold">Buy me Zobo</p>
        </div>
    )
}
