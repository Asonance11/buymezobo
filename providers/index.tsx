import { ReactNode } from 'react';
import { InterfaceProvider } from './InterfaceProvider';

interface ProviderProps {
	children: ReactNode;
}

export default function Provider({ children }: ProviderProps) {
	return (
		<>
			<InterfaceProvider />
			{children}
		</>
	);
}
