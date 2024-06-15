import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
	prompt: string;
}

export default function TooltipPrimitive({ children, prompt }: Props) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent>
					<p>{prompt}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
