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
					error: 'bg-red-500 border-none',
					success: 'bg-white text-black border-none',
					warning: 'text-yellow-400 border-none',
					info: 'bg-blue-400 border-none',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
