"use client"
import { bai, manrope, rubik } from "@/lib/fonts";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";

export default function About() {

    const title = useRef(null)
    const soc1 = useRef(null)
    const soc2 = useRef(null)
    const soc3 = useRef(null)

    const socials = [
        {
            icon: <FaXTwitter />,
            link: "https://twitter.com/sijisaidwhat",
            ref: soc1,
        },
        {
            icon: <FaLinkedin />,
            link: "https://www.linkedin.com/in/oluwasijibomi-ilesanmi-8504b123a/",
            ref: soc2,
        },
        {
            icon: <FaGithub />,
            link: "https://github.com/sijirama",
            ref: soc3,
        },
    ];

    useGSAP(() => {
        const tl = gsap.timeline({})
        tl.from(title.current, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power3.inOut",
            delay:0.5
        })

        tl.from([soc1.current, soc2.current, soc3.current], {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.inOut",
            stagger:{
                amount:0.2
            }
        }, ">+0.3")
    }, { scope: title })

    return (
        <main className={`min-h-screen items-center pt-8 md:pt-10 lg:pt-14 -tracking-wider bg-white ${manrope.className} grid grid-cols-1 md:grid-cols-2 grid-rows-5 md:grid-rows-1 text-black`}>
            <div className={`h-full w-full flex flex-col items-center justify-center gap-2`}>
                <p ref={title} className={`text-[4rem] lg:text-[6rem] font-semibold ${rubik.className} -tracking-widest px-5 md:text-center w-full`}>about /</p>
                <div className="flex gap-3 items-center justify-start md:justify-center w-full px-5">
                    {socials.map((social, index) => (
                        <a key={index} href={`${social.link}`} ref={social.ref} target="_blank">
                            <div className="p-2 hover:text-gray-500  cursor-pointer border border-zinc-900 rounded-[0.58rem] flex items-center justify-center text-gray-600 transition-colors duration-200 text-sm md:text-xl" >{social.icon}</div>
                        </a>
                    ))}
                </div>
            </div>
            <div className="h-full w-full row-span-4 flex flex-col items-center justify-center px-5 gap-2 py-7 -tracking-wider">
                <div className="mx-auto flex gap-1 flex-col ">
                    <p>
                        my name is Oluwasijibomi Ilesanmi, currently studying software engineering as a final year student at Babcock University. I have a deep passion for crafting applications that not only solve problems but also contribute positively to the well-being of humanity.
                    </p>
                    <p>
                    </p>
                    <p>
                        My dream is to work in an environment where I feel like a superhero, saving lives with the code I write. I aim to build applications that make a real impact and become lifelines for those who need it most.
                    </p>
                </div>
                <div className="w-full">
                    <p>i am currently...</p>
                    <ul className="pl-4 list-disc">
                        <li>studying software engineering at Babcock University (i graduate june 2024!)</li>
                        <li>making preparations to begin reading the Bhagavad Gita, a Hindu holy book.</li>
                        <li>building projects to begin my Job hunt next year</li>
                        <li>my final year project for university.</li>
                    </ul>
                </div>
                <div className="w-full">
                    <p>i am really excited about...</p>
                    <ul className="pl-4 list-disc">
                        <li>the interesting discourse at intersection of science and religion, exploring nuanced discussions on origins, evolution, and ultimate outcomes.</li>
                        <li>engineering that can transform lives.</li>
                        <li>music and people that share music, sharing music is a love language.</li>
                        <li>the future and what it holds for us.</li>
                    </ul>
                </div>

            </div>
        </main>
    )
}
