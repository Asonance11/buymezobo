import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Loading from '../../loading';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextInput } from '@/components/ui/TextInput';
import { toast } from '@/components/ui/use-toast';
import { LoadingOutlined } from '@ant-design/icons';
import { Form, FormField } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useUser } from '@/store/UserDataStore';
import { updateProfile, changePassword } from '@/actions/profile';
import axios from 'axios';
import { Bank } from '@/types/bank';
import { CONFIG } from '@/utility/config';

const accountInputSchema = z.object({
	firstName: z.string().min(1).max(40).trim(),
	lastName: z.string().min(1).max(40).trim(),
	userName: z.string().min(1).max(40).trim(),
	email: z.string().email().min(1).max(60),
});

const passwordInputSchema = z.object({
	oldPassword: z
		.string()
		.min(6, { message: 'Password must be a minimum of 6 characters' })
		.max(25, { message: 'Password must not be more than 25 characters' })
		.trim(),
	newPassword: z
		.string()
		.min(6, { message: 'Password must be a minimum of 6 characters' })
		.max(25, { message: 'Password must not be more than 25 characters' })
		.trim(),
});

type AccountInput = z.infer<typeof accountInputSchema>;
type PasswordInput = z.infer<typeof passwordInputSchema>;

export default function EditAccountForm() {
	const [loading, setLoading] = useState(true);
	const [accountLoading, setAccountLoading] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);
	const { loggedInUser } = useUser();
	const [banks, setBanks] = useState<Bank[]>([]);
	const [bankName, setBankName] = useState('');

	const accountForm = useForm<AccountInput>({
		resolver: zodResolver(accountInputSchema),
		defaultValues: { firstName: '', lastName: '', email: '', userName: '' },
	});

	const passwordForm = useForm<PasswordInput>({
		resolver: zodResolver(passwordInputSchema),
		defaultValues: { oldPassword: '', newPassword: '' },
	});
	async function getBankName() {
		const foundBank = banks.filter((bank) => bank.code === loggedInUser?.bankCode)[0];
		if (foundBank) {
			setBankName(() => foundBank.name);
		}
	}
	useEffect(() => {
		const fetchBanks = async () => {
			try {
				setLoading(true);
				const response = await axios.get('https://api.paystack.co/bank', {
					headers: {
						Authorization: `Bearer ${CONFIG.paystack_key}`,
					},
				});
				setBanks(response.data.data);
			} catch (error) {
				console.error('Error fetching banks:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchBanks();
	}, []);
	useEffect(() => {
		getBankName();
	}, [banks]);
	useEffect(() => {
		async function fetchProfile() {
			if (loggedInUser) {
				const { firstName, lastName, email, userName } = loggedInUser;
				accountForm.reset({ firstName, lastName, email, userName });
			}
			setLoading(false);
		}
		fetchProfile();
	}, [accountForm]);

	async function onUpdateAccount(data: z.infer<typeof accountInputSchema>) {
		setAccountLoading(true);
		try {
			// throw new Error('');
			const isValid = await accountForm.trigger();
			if (isValid && loggedInUser) {
				await updateProfile(data);
				toast({
					title: 'Account Update ',
					description: 'Sucessfully updated loggedInUser',
					variant: 'success',
				});
			}
		} catch (err: any) {
			toast({
				title: 'Account Update ',
				description: err.message,
				variant: 'destructive',
			});
			throw err;
		} finally {
			setAccountLoading(false);
		}
	}

	const router = useRouter();

	const onUpdatePassword: SubmitHandler<PasswordInput> = async (data) => {
		setPasswordLoading(true);
		try {
			// throw new Error('');
			const isValid = await accountForm.trigger();
			if (isValid && loggedInUser) {
				const { oldPassword, newPassword } = data;
				await changePassword(loggedInUser.id, oldPassword, newPassword);
				toast({
					title: 'Password Update ',
					description: 'Sucessfully updated password',
					variant: 'success',
				});
				router.push('/signin');
			}
		} catch (err: any) {
			toast({
				title: 'Password Update ',
				description: err.message,
				variant: 'destructive',
			});
			throw err;
		} finally {
			setPasswordLoading(false);
		}
	};

	if (loading) return <Loading />;
	return (
		<div className=" w-[90%] flex justify-center ">
			<Tabs defaultValue="account" className="w-full max-w-[36rem] ">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="account">Account</TabsTrigger>
					<TabsTrigger value="password">Password</TabsTrigger>
					<TabsTrigger value="bank">Bank Details</TabsTrigger>
				</TabsList>
				<TabsContent value="account">
					<Form {...accountForm}>
						<form onSubmit={accountForm.handleSubmit(onUpdateAccount)}>
							<Card>
								<CardHeader>
									<CardTitle>Account</CardTitle>
									<CardDescription>
										Make changes to your account here. Click save when you&apos;re done.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className=" grid w-full grid-cols-2 gap-3">
										<FormField
											name="firstName"
											control={accountForm.control}
											rules={{ required: true }}
											render={({ field }) => (
												<TextInput
													label="First name"
													id="firstname"
													error={accountForm.formState.errors.firstName?.message}
													{...field}
													disabled
												/>
											)}
										/>
										<FormField
											name="lastName"
											control={accountForm.control}
											rules={{ required: true }}
											render={({ field }) => (
												<TextInput
													label="Last name"
													id="lastname"
													error={accountForm.formState.errors.lastName?.message}
													{...field}
													disabled
												/>
											)}
										/>
									</div>
									<FormField
										name="email"
										control={accountForm.control}
										rules={{ required: true }}
										render={({ field }) => (
											<TextInput
												label="Email address"
												id="email"
												error={accountForm.formState.errors.email?.message}
												{...field}
												disabled
											/>
										)}
									/>
									<FormField
										name="userName"
										control={accountForm.control}
										rules={{ required: true }}
										render={({ field }) => (
											<TextInput
												disabled
												label="Username"
												id="username"
												error={accountForm.formState.errors.userName?.message}
												{...field}
											/>
										)}
									/>
								</CardContent>
								<CardFooter>
									<Button
										className=" bg-black hover:bg-purple-700"
										onClick={accountForm.handleSubmit(onUpdateAccount)}
										disabled={!accountForm.formState.isDirty || accountLoading}
									>
										{accountLoading ? <LoadingOutlined /> : 'Save changes'}
									</Button>
								</CardFooter>
							</Card>
						</form>
					</Form>
				</TabsContent>
				<TabsContent value="password">
					<Form {...passwordForm}>
						<form onSubmit={passwordForm.handleSubmit(onUpdatePassword)}>
							<Card>
								<CardHeader>
									<CardTitle>Password</CardTitle>
									<CardDescription>
										Change your password here. After saving, you&apos;ll be logged out.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									<FormField
										name="oldPassword"
										control={passwordForm.control}
										rules={{ required: true }}
										render={({ field }) => (
											<TextInput
												version="password"
												id="current-password"
												label="Current Password"
												error={passwordForm.formState.errors.oldPassword?.message}
												{...field}
												required
											/>
										)}
									/>
									<FormField
										name="newPassword"
										control={passwordForm.control}
										rules={{ required: true }}
										render={({ field }) => (
											<TextInput
												version="password"
												id="new-password"
												label="New Password"
												error={passwordForm.formState.errors.newPassword?.message}
												{...field}
												required
											/>
										)}
									/>
								</CardContent>
								<CardFooter>
									<Button
										className=" bg-black hover:bg-purple-700"
										onClick={passwordForm.handleSubmit(onUpdatePassword)}
										disabled={!passwordForm.formState.isDirty || passwordLoading}
									>
										{passwordLoading ? <LoadingOutlined /> : 'Save password'}
									</Button>
								</CardFooter>
							</Card>
						</form>
					</Form>
				</TabsContent>
				<TabsContent value="bank">
					<Card>
						<CardHeader>
							<CardTitle>Bank Details</CardTitle>
							<CardDescription>View your bank details here.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<TextInput label="Bank Name" id="bank-name" disabled value={bankName} />
							<TextInput
								label="Account Number"
								id="account-no"
								disabled
								value={loggedInUser?.accountNumber}
							/>
							<TextInput
								label="Bank Account Name"
								id="bank-name"
								disabled
								value={loggedInUser?.bankAccountName}
							/>
						</CardContent>
						<CardFooter>
							<p>
								<small className=" text-red-500">Account details are currently readonly</small>
							</p>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
