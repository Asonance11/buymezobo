'use client';

import { signup } from '@/actions/signup';
import { Logo } from '@/components/common/Logo';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/button';
import { SignUp } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { LoadingOutlined } from '@ant-design/icons';
import * as z from 'zod';

const SignUpSchema = z.object({
	email: z.string().email().min(1, { message: 'This field is required' }).trim(),
	password: z
		.string()
		.min(6, { message: 'Password must be a minimum of 6 characters' })
		.max(12, { message: 'Password must not exceed 12 characters' })
		.trim(),
});

type SignUpInputType = z.infer<typeof SignUpSchema>;

export default function Page() {
	const emailRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);
	const [loading, setLoading] = useState(false);

	const {
		handleSubmit,
		control,
		trigger,
		reset,
		watch,
		formState: { errors },
	} = useForm<SignUpInputType>({
		resolver: zodResolver(SignUpSchema),
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

	const onSignUpSubmit: SubmitHandler<SignUpInputType> = async (data) => {
		const isValid = await trigger();
		if (isValid) {
			setLoading(true);
			try {
				await signup(data);
			} catch (error) {
				throw error;
			} finally {
				setLoading(false);
			}
		}
		reset();
	};

	return (
		<section className=" w-full h-[100vh] flex items-center justify-center flex-col">
			<nav className=" fixed top-3">
				<Logo />
			</nav>
			<form
				onSubmit={handleSubmit(onSignUpSubmit)}
				className=" flex flex-col gap-8 w-[30%] min-w-80 px-8 py-16 h-fit border-solid border-slate-300 border-[1px] rounded-sm shadow-md"
			>
				<Controller
					name="email"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput inputRef={emailRef} label="Email address" {...field} error={errors.email?.message} />
					)}
				/>
				<Controller
					name="password"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							inputRef={passwordRef}
							label="Password"
							{...field}
							error={errors.password?.message}
						/>
					)}
				/>
				<p className=" text-sm font-semibold">
					Have an account?{' '}
					<a href="/signin" className=" text-red-500">
						Login
					</a>
				</p>
				<Button className=" font-semibold self-center w-full " disabled={loading}>
					{loading ? <LoadingOutlined /> : 'Sign Up'}
				</Button>
			</form>
		</section>
	);
}
