'use client';

import { ReactNode } from 'react';
import { InterfaceProvider } from './InterfaceProvider';
import { SessionProvider } from 'next-auth/react';

interface ProviderProps {
	children: ReactNode;
}

export default function Provider({ children }: ProviderProps) {
	return (
		<>
			{/* Dont remove */}
			<SessionProvider>{children}</SessionProvider>
			<InterfaceProvider />
		</>
	);
}
