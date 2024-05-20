import * as React from 'react';
import { CiWarning } from 'react-icons/ci';

import { cn } from '@/utility/style';
import { Input } from './input';
import { PasswordInput } from './passwordInput';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	id: string;
	inputRef?: React.ForwardedRef<HTMLInputElement>;
	error?: string;
	required?: boolean;
	version?: 'text' | 'password';
}

const TextInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	let { required, version, ...properties } = props;
	return (
		<div className=" space-y-1">
			<label htmlFor={properties.id} className=" font-semibold">
				{properties.label}
				{required && <span className=" text-red-400">*</span>}
			</label>

			{version === 'password' ? (
				<PasswordInput ref={properties.inputRef} {...properties} />
			) : (
				<Input type={type} ref={properties.inputRef} {...properties} />
			)}

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
