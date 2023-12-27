"use client"
import { manrope } from "@/lib/fonts"
import { useRef } from 'react'

interface Props {
    word: string
    link?: string
}
function SpanWord({ word, link }: Props) {
    return <a href={link ?? link} target="_blank">
        <span className="border border-white rounded-xl px-2">
            {word}
        </span>
    </a>
}

export default function JobHunt() {
    return <section className="w-full h-full bg-black text-white items-center flex px-4 md:px-5 mx-auto">
        <div className=" w-full md:w-2/3 flex items-center h-full">
            <p id='target' className={`${manrope.className} text-xl`} >
                this is Oluwasijibomi Ilesanmis homepage, <SpanWord word={"Oluwasijibomi"} /> is software developer in Lagos, Nigeria that likes interacting with and developing for the world wide web, he is genuinely interested in developing software. Soon to be a graduate from Babcock University he is currently looking for full-time opportinities, freelance work or collaborative projects. Contact him via <SpanWord word="Twitter/X" link="https://www.twitter.com/sijisaidwhat" /> or <SpanWord word="Github" link="https://github.com/sijirama" /> or even <SpanWord word="LinkedIn" link="https://www.linkedin.com/in/oluwasijibomi-ilesanmi-8504b123a/" /> although he despises it.
            </p>
        </div>
    </section>
}


