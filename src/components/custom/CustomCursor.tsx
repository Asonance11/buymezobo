"use client"
import { useEffect, useState, useRef } from "react"
import gsap from "gsap"

interface CursorProps {
    show?:boolean | null
}

export default function Cursor({show}:CursorProps) {
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0
    })
    const cursor = useRef(null)
    if(!cursor) show = false

    useEffect(() => {
        const mousemove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            })

        }
        window.addEventListener("mousemove", mousemove)
        return () => {
            window.removeEventListener("mousemove", mousemove)
        }
    }, [])

    gsap.to(cursor.current, {
        x: mousePosition.x - 56,
        y: mousePosition.y - 56,
    })

    return (
        <div ref={cursor} className={`cursor cursor-none fixed w-28 h-28 rounded-full bg-yellow-500 ${show?(null):("hidden")}`}></div>
    )
}

