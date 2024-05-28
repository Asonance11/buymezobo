'use client';

import { ReactNode } from 'react';
import { InterfaceProvider } from './InterfaceProvider';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface ProviderProps {
	children: ReactNode;
}

const queryClient = new QueryClient();

export default function Provider({ children }: ProviderProps) {
	return (
		<>
			{/* Dont remove */}
			<QueryClientProvider client={queryClient}>
				<SessionProvider>{children}</SessionProvider>
				<InterfaceProvider />
				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			</QueryClientProvider>
		</>
	);
}
