import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface ProviderProps {
    children: ReactNode
}

export default function Provider({ children }: ProviderProps) {
    return <>
        <ClerkProvider>
            {children}
        </ClerkProvider >
    </>
}



 




