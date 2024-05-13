'use client';

import type { Metadata } from 'next';
import { Logo } from '@/components/common/Logo';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';

// export const metadata: Metadata = {
// 	title: 'Sign In',
// };

const LoginSchema = z.object({
	email: z.string().email().min(1, { message: 'This field is required' }),
	password: z
		.string()
		.min(1, { message: 'This field is required' })
		.max(12, { message: 'Password must not exceed 12 characters' })
		.trim(),
});

type LoginInputType = z.infer<typeof LoginSchema>;

export default function Page() {
	const emailRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);

	const {
		handleSubmit,
		control,
		trigger,
		reset,
		watch,
		formState: { errors },
	} = useForm<LoginInputType>({
		resolver: zodResolver(LoginSchema),
		defaultValues: { email: '', password: '' },
	});

	useEffect(() => {
		const subscription = watch((value, { name, type }) => console.log(value, name, type));
		return () => subscription.unsubscribe();
	}, [watch]);

	useEffect(() => {
		if (errors.email) {
			emailRef.current?.focus();
		} else if (errors.password) {
			passwordRef.current?.focus();
		}
	}, [errors]);

	const onLoginSubmit: SubmitHandler<LoginInputType> = async (data) => {
		const isValid = await trigger();
		if (isValid) {
		}
		reset();
	};

	return (
		<section className=" w-full h-[100vh] flex items-center justify-center flex-col">
			<nav className=" fixed top-3">
				<Logo />
			</nav>
			<form
				onSubmit={handleSubmit(onLoginSubmit)}
				className=" flex flex-col gap-8 w-[30%] min-w-[300px] px-8 py-16 h-1/2 border-solid border-slate-300 border-[1px] rounded-sm shadow-md"
			>
				<Controller
					name="email"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							{...field}
							required
							inputRef={emailRef}
							label="Email address"
							error={errors.email?.message}
						/>
					)}
				/>
				<Controller
					name="password"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							{...field}
							required
							inputRef={passwordRef}
							label="Password"
							error={errors.password?.message}
						/>
					)}
				/>
				<Button className=" font-semibold self-center w-full ">Login</Button>
			</form>
		</section>
	);
}
