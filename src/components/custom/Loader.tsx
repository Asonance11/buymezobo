"use client"

import { useEffect, useState } from "react";

const Loader = () => {
    const [loading, setLoading] = useState(true)
    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(false)
    //     }, 10000)
    // }, [])
    return (
        <main className={`z-[100] bg-black items-center justify-center fixed w-screen h-screen ${loading ? "flex" : "hidden"}`}>
            Loading...
        </main>
    );
};

export default Loader;

