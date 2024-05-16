'use client';

import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingOutlined } from '@ant-design/icons';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from '@/actions/signin';
import { useAuth } from '@/actions/use-auth';
import { PasswordInput } from '@/components/ui/passwordInput';

const SignInSchema = z.object({
	email: z.string({ required_error: 'This field is required' }).email().trim(),
	password: z.string({ required_error: 'This field is required' }).trim(),
});

export default function Page() {
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: { email: '', password: '' },
	});

	async function onSubmit(values: z.infer<typeof SignInSchema>) {
		const isValid = await form.trigger();
		if (isValid) {
			setLoading(true);
			try {
				await login(values);
			} catch (error) {
				throw error;
			} finally {
				setLoading(false);
			}
		}
		form.reset();
	}

	return (
		<section className=" w-full h-[100vh] flex items-center justify-center flex-col">
			<nav className=" fixed top-3">
				<Logo />
			</nav>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className=" flex flex-col gap-8 w-[25%] min-w-80 px-8 py-16 h-fit border-solid border-slate-300  rounded-lg shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]

                    "
				>
					<div className="spece-y-3">
						<p className="text-2xl font-bold -tracking-wide">Sign In</p>
						<p className="text-sm text-gray-500 tracking-wide">to continue to buymezobo</p>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email adress</FormLabel>
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
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className=" font-semibold self-center w-full " disabled={loading}>
						{loading ? <LoadingOutlined /> : 'Continue'}
					</Button>

					<p className=" text-sm font-light">
						Do not have an account?{' '}
						<a href="/signup" className="font-semibold text-purple-800">
							Create a new account
						</a>
					</p>
				</form>
			</Form>
		</section>
	);
}
