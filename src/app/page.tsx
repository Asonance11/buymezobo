"use client"
import { FaArrowDownLong } from "react-icons/fa6";
import { FaStarOfLife } from "react-icons/fa6";
import { manrope } from "@/lib/fonts"
import gsap from "gsap"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"

export default function Home() {
    const name1 = useRef(null)
    const name2 = useRef(null)
    const image = useRef(null)
    const title = useRef(null)
    const title2 = useRef(null)
    const icon = useRef(null)

    useGSAP(() => {
        const tl = gsap.timeline({})
        tl.from([name1.current, name2.current], {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.inOut",
            stagger: {
                amount: 0.1
            }
        })

        tl.from([title.current, title2.current], {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.inOut",
            stagger: {
                amount: 0.1
            }

        }, ">")
        tl.from(image.current, {
            duration: 0.75,
            y: 100,
            opacity: 0,
            ease: 'power2.inOut' // Easing function for the animation
        }, ">+0.2");

        tl.to(icon.current, {
            rotate: 360,
            duration: 2,
            repeat:-1,
            ease:"none"
        }, ">+1")

    }, { scope: title })

    return (
        <main className=" min-h-screen gap-2 flex flex-col justify-center lg:justify-normal lg:grid grid-col-1 w-screen px-2 lg:px-5 items-center py-10 lg:pt-16 bg-white text-black">
            <div className="flex items-center justify-start w-full text-start overflow-hidden ">
                <h1 ref={name1} className={`overflow-hidden text-6xl/none md:text-7xl/none lg:text-[7rem]/none font-bold -tracking-widest ${manrope.className}`}>
                    Oluwasijibomi{" "}
                    <span ref={name2} className="block">Ilesanmi</span>
                </h1>
            </div>
            <div className="w-full">
                <div className="h-48 lg:h-56 w-full overflow-hidden">
                    <img ref={image} src="/images/aphrodite.jpg" alt="image" className="w-full h-full object-cover" />
                </div>
            </div>
            <div className="flex justify-between items-center text-start lg:text-end w-full">

                <div className="lg:flex gap-7 items-center hidden ">
                    <div ref={icon} className="bg-black rounded-full h-36 w-36 text-white font-extrabold flex items-center justify-center">
                        <FaStarOfLife size={72} />
                    </div>
                    <div className="text-black w-72 h-5/6">
                        <p className={`text-xs font-light text-start ${manrope.className}`}>Greetings! I'm a passionate developer driven by the belief that technology can shape a better tomorrow. With a commitment to innovation and sustainable solutions, I embark on a coding journey to contribute my part in saving the future. Let's create a world where technology serves humanity and preserves our planet for generations to come.</p>
                    </div>
                </div>

                <h1 ref={title} className={`text-6xl/none md:text-7xl/none lg:text-[7rem]/none font-bold -tracking-widest ${manrope.className}`}>
                    Software
                    <span ref={title2} className="block">Developer</span>
                </h1>
            </div>
        </main>
    )
}
