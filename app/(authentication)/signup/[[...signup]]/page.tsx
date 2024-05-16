'use client';

import { signup } from '@/actions/signup';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingOutlined } from '@ant-design/icons';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const SignUpSchema = z.object({
    email: z.string().email().min(1, { message: 'This field is required' }).trim(),
    password: z
        .string()
        .min(6, { message: 'Password must be a minimum of 6 characters' })
        .max(12, { message: 'Password must not exceed 12 characters' })
        .trim(),
});

export default function Page() {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: { email: '', password: '' },
    });

    async function onSubmit(values: z.infer<typeof SignUpSchema>) {
        const isValid = await form.trigger();
        if (isValid) {
            setLoading(true);
            try {
                await signup(values);
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
                    className=" flex flex-col gap-8 w-[30%] min-w-80 px-8 py-16 h-fit border-solid border-slate-300 border-[1px] rounded-sm shadow-sm"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email adress</FormLabel>
                                <FormControl>
                                    <Input className="w-full resize-none" {...field} placeholder="" />
                                </FormControl>
                                <FormDescription>your email address to sign up</FormDescription>
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
                                    <Input className="w-full resize-none" {...field} placeholder="" />
                                </FormControl>
                                <FormDescription>we hash your passwords for safety</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <p className=" text-sm font-semibold">
                        Have an account?{' '}
                        <a href="/signin" className=" text-purple-800">
                            Login
                        </a>
                    </p>
                    <Button className=" font-semibold self-center w-full " disabled={loading}>
                        {loading ? <LoadingOutlined /> : 'Sign Up'}
                    </Button>
                </form>
            </Form>
        </section>
    );
}
