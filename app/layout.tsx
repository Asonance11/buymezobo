import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Buy me Zobo",
    description: "support your favourite Nigerian creatives",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
            <Provider>
                <body className={inter.className}>{children}</body>
            </Provider>
        </html>
    );
}
