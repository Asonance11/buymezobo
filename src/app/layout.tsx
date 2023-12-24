import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/custom/Header'
import LatestUpdateComponent from '@/components/custom/LifeUpdate'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Sijis Playground',
    description: 'learning cool animation stuff',
}


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {


    return (
        <html lang="en">
            <body className={inter.className}>
                <Header />
                <main>
                    {children}
                </main>

            </body>
        </html>
    )
}
