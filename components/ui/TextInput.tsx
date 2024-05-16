import * as React from 'react';
import { CiWarning } from 'react-icons/ci';

import { cn } from '@/utility/style';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	inputRef?: React.ForwardedRef<HTMLInputElement>;
	error?: string;
	required?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	let { required, ...properties } = props;
	return (
		<div className=" flex flex-col gap-2">
			<label htmlFor="" className=" font-semibold">
				{properties.label}
				{required && <span className=" text-red-400">*</span>}
			</label>
			<input
				type={type}
				className={cn(
					'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
				ref={properties.inputRef}
				{...properties}
			/>
			{props.error && (
				<small className=" text-red-500 flex items-center gap-2">
					<CiWarning /> {properties.error}
				</small>
			)}
		</div>
	);
});
TextInput.displayName = 'Input';

export { TextInput };
