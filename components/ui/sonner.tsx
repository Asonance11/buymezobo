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
					error: 'bg-red-400',
					success: 'text-purple-600',
					warning: 'text-yellow-400',
					info: 'bg-blue-400',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
