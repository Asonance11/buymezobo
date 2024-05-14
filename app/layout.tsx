import type { Metadata } from 'next';
import './globals.css';
import Provider from '@/providers';
import { cn } from '@/utility/style';
import { fontSans } from '@/utility/fonts';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: 'Buy me Zobo',
    description: 'support your favourite Nigerian creatives',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
            <Provider>
                <Toaster />
                <body
                    suppressHydrationWarning
                    suppressContentEditableWarning
                    className={cn('min-h-dvh bg-background font-sans antialiased', fontSans.variable)}
                >
                    {children}
                </body>
            </Provider>
        </html>
    );
}
