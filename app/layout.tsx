import type { Metadata } from 'next';
import './globals.css';
import Provider from '@/providers';
import { cn } from '@/utility/style';
import { fontSans } from '@/utility/fonts';
import { Toaster } from '@/components/ui/sonner';
import 'react-photo-view/dist/react-photo-view.css';
import { ChakraProvider } from '@chakra-ui/react';
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

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
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<ColorSchemeScript />
			</head>
			<Provider>
				<body
					suppressHydrationWarning
					suppressContentEditableWarning
					className={cn('min-h-dvh bg-background font-sans antialiased', fontSans.variable)}
				>
					<ChakraProvider>
						<MantineProvider>{children}</MantineProvider>
					</ChakraProvider>
					<Toaster theme="light" />
				</body>
			</Provider>
		</html>
	);
}
