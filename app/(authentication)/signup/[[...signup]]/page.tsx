'use client';

import { signup } from '@/actions/signup';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingOutlined } from '@ant-design/icons';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/passwordInput';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import { useUser } from '@/store/UserDataStore';
import { useAuth as getAuth } from '@/actions/use-auth';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

const SignUpSchema = z.object({
	email: z.string().email().min(1, { message: 'This field is required' }).trim(),
	password: z
		.string()
		.min(6, { message: 'Password must be a minimum of 6 characters' })
		.trim(),
	firstName: z.string().max(50),
	lastName: z.string().max(50),
});

export default function Page() {
	const [loading, setLoading] = useState(false);
	const { updateUser } = useUser();
	useEffect(() => {
		const fetchProfile = async () => {
			setLoading(true);
			const { user } = await getAuth();
			if (user) {
				redirect('/dashboard');
			}
			updateUser(user);
			setLoading(false);
		};
		fetchProfile();
	}, []);
	const form = useForm<z.infer<typeof SignUpSchema>>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: { email: '', password: '' },
	});

	async function onSubmit(values: z.infer<typeof SignUpSchema>) {
		const isValid = await form.trigger();
		if (isValid) {
			setLoading(true);
			try {
				const result = await signup(values);
				if (result.success) {
					const { user } = await getAuth();
					if (user) {
						await updateUser(user);
						toast.success('Account created successfully!');
					}
					form.reset();
				} else {
					toast.error(result.error);
				}
			} catch (error) {
				toast.error('An unexpected error occurred.');
			} finally {
				setLoading(false);
			}
		}
	}

	return (
		<section className=" relative flex justify-center items-center w-full h-full">
			<nav className=" fixed top-3">
				<Logo className="hidden lg:block" textClassName="font-sm" />
			</nav>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className=" flex flex-col gap-8 w-[50%] min-w-[22rem] px-2.5 md:px-4 lg:px-8 h-fit border-solid border-slate-300  
                    "
				>
					<div className="space-y-3">
						<p className="text-lg lg:text-2xl font-bold -tracking-wide">Create an Account</p>
						<p className="text-sm text-gray-500 tracking-wide">to continue to buymezobo</p>
					</div>

					<div className="flex items-center gap-1.5 lg:gap-3">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Firstname</FormLabel>
									<FormControl>
										<Input className="w-full resize-none" {...field} placeholder="" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Lastname</FormLabel>
									<FormControl>
										<Input className="w-full resize-none" {...field} placeholder="" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email address</FormLabel>
								<FormControl>
									<Input className="w-full resize-none" {...field} placeholder="" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<PasswordInput className="w-full resize-none" {...field} placeholder="" />
								</FormControl>
								<FormDescription className="text-sm">
									We hash your passwords to prevent from malicious attacks
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div id="providers" className=" space-y-2">
						<Button className="text-sm md:text-base font-semibold self-center w-full " disabled={loading}>
							{loading ? <LoadingOutlined /> : 'Continue'}
						</Button>
						<Button
							type="button"
							onClick={() => {
								signIn('google');
							}}
							className=" flex gap-2 bg-inherit text-xs text-black border-[1px] border-solid border-slate-300 w-full hover:text-initial hover:bg-initial shadow-md rounded-sm hover:shadow-none font-bold"
						>
							<FcGoogle className=" text-lg" />
							Continue with Google
						</Button>
					</div>

					<p className=" text-sm font-light">
						Have an account?{' '}
						<a href="/signin" className="font-semibold text-purple-800">
							Login
						</a>
					</p>
				</form>
			</Form>
		</section>
	);
}
