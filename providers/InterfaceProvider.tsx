'use client'

import { SearchCreatorMenu } from "@/components/Interface/SearchCreators";
import { useEffect, useState } from "react";
export function InterfaceProvider() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <SearchCreatorMenu />
        </>
    )

}
