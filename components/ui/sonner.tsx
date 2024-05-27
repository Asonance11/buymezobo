'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className="toaster group"
			toastOptions={{
				classNames: {
					error: 'bg-red-500',
					success: 'bg-white text-purple-800',
					warning: 'text-yellow-400',
					info: 'bg-blue-400',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
