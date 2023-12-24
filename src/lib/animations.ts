import gsap from "gsap"

export const maintimeline = gsap.timeline({})


export const staggerReveal = (tl2: gsap.core.Timeline, node1: any, node2: any) => {
    tl2.from([node1, node2], {
        duration: 0.8,
        height: 0,
        transformOrigin: 'right top',
        skewY: 2,
        ease: "power3.inOut",
        stagger: {
            amount: 0.1
        }
    })
}

export const staggerText = (tl2: gsap.core.Timeline, node1: any, node2: any, node3: any) => {
    tl2.from([node1, node2, node3], {
        duration: 0.8,
        y: 100,
        ease: "power3.inOut",
        opacity:0,
        stagger: {
            amount: 0.4
        },
    }, "<0.2")
}


export const fadeInUp = (tl2: gsap.core.Timeline, node: any) => {
    tl2.from(node, {
        y: 60,
        duration: 1,
        opacity: 0,
        ease: "power3.inOut"
    }, "<0.2")
}

