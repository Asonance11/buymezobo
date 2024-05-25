'use client';

import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GoogleOutlined, LoadingOutlined } from '@ant-design/icons';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from '@/actions/signin';
import { useAuth as getAuth } from '@/actions/use-auth';
import { PasswordInput } from '@/components/ui/passwordInput';
import { signIn, useSession } from 'next-auth/react';
import { User } from 'lucia';

const SignInSchema = z.object({
	email: z.string().email().min(1, { message: 'This field is required' }).trim(),
	password: z
		.string()
		.min(6, { message: 'Password must be a minimum of 6 characters' })
		.max(12, { message: 'Password must not exceed 12 characters' })
		.trim(),
});

export default function Page() {
	const [loading, setLoading] = useState(false);
	const [profile, setProfile] = useState<User | null>();

	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: { email: '', password: '' },
	});

	useEffect(() => {
		const fetchUser = async () => {
			const { user } = await getAuth();
			setProfile(user);
		};
		fetchUser();
	}, []);

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
				<Logo className="hidden lg:block" />
			</nav>
			{profile && profile.email}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className=" flex flex-col gap-8 w-[25%] min-w-[22rem] px-2.5 md:px-4 lg:px-8 py-10 h-fit border-solid border-slate-300  rounded-lg md:shadow-sm  lg:shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)]

                    "
				>
					<div className="space-y-3">
						<p className="text-2xl font-bold -tracking-wide">Sign In</p>
						<p className="text-sm text-gray-500 tracking-wide">to continue to buymezobo</p>
					</div>
					<div id="providers">
						<Button
							type="button"
							onClick={() => {
								signIn('google');
							}}
							className=" flex gap-2 bg-inherit text-sm text-black border-[1px] border-solid border-slate-300 w-full hover:text-initial hover:bg-initial shadow-md rounded-sm hover:shadow-none"
						>
							<GoogleOutlined />
							Continue with Google
						</Button>
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
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className="text-sm md:text-base font-semibold self-center w-full " disabled={loading}>
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
