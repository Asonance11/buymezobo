'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useWizard } from 'react-use-wizard';
import { usePersonForm } from './UserAfterForm';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/utility/config';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bank } from '@/types/bank';
import Loader from '@/components/common/Loader';
import { LoadingOutlined } from '@ant-design/icons';

type personType = {
	accountNumber: string;
	bankCode: string;
	userName: string;
	bankAccountName: string;
	bankName: string;
};

export default function BankInfoStep() {
	const { nextStep } = useWizard();
	const { state } = usePersonForm();
	const [accountNumber, setAccountNumber] = useState('');
	const [personData, setPersonData] = useState<personType | null>(null);
	const route = useRouter();
	const [checking, setChecking] = useState(false);
	const [banks, setBanks] = useState<Bank[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchBanks = async () => {
			try {
				const response = await axios.get('https://api.paystack.co/bank', {
					headers: {
						Authorization: `Bearer ${CONFIG.paystack_key}`,
					},
				});
				setBanks(response.data.data);
			} catch (error) {
				console.error('Error fetching banks:', error);
			}
		};
		fetchBanks();
	}, []);

	const skip = useCallback(async () => {
		state.values.BankCode = '';
		state.values.AccountNumber = '';

		const data = {
			userName: state.values.UserName,
		};

		try {
			const postResponse = await axios.post('/api/auth/aftersignup', data);
			console.log('POST request sent to /api/auth/aftersignup:', postResponse.data);
			if (postResponse.status === 200) {
				route.push('/');
			}
		} catch (err) {
			console.error('Error sending POST request to /api/auth/aftersignup:', err);
		}

		route.push('/dashboard');
	}, [state.values]);

	const confirmAccount = useCallback(async () => {
		setChecking(true);
		setPersonData(null);
		const data = {
			accountNumber: state.values.AccountNumber,
			bankCode: state.values.BankCode,
			userName: state.values.UserName,
			bankAccountName: '',
			bankName: '',
		};

		try {
			const response = await axios.get(
				`https://api.paystack.co/bank/resolve?account_number=${state.values.AccountNumber}&bank_code=${state.values.BankCode}`,
				{
					headers: {
						Authorization: `Bearer ${CONFIG.paystack_key}`,
					},
				},
			);

			const responseData = response.data;

			data.bankAccountName = responseData.data.account_name;

			const bankName = banks.find((bank) => bank.code === data.bankCode)?.name ?? '';
			setPersonData({ ...data, bankName });
			setChecking(false);
		} catch (err) {
			console.error('Error resolving bank account:', err);
			setChecking(false);
			toast.error('Invalid Account Details');
		}
	}, [banks, state.values]);

	const next = useCallback(async () => {
		setLoading(true);
		try {
			if (personData) {
				const postResponse = await axios.post('/api/auth/aftersignup', personData);
				console.log('POST request sent to /api/auth/aftersignup:', postResponse.data);
				if (postResponse.status === 200) {
					route.push('/');
				}
			}
		} catch (error) {
			console.error('Error sending POST request to /api/auth/aftersignup:', error);
		} finally {
			setLoading(false);
		}
	}, [personData, route]);

	const handleBankSelect = useCallback(
		(bankCode: string) => {
			state.values.BankCode = bankCode;
			console.log(bankCode);
			if (accountNumber.length === 10 && bankCode) {
				confirmAccount();
			}
		},
		[accountNumber.length, confirmAccount, state.values],
	);

	const handleAccountNumberChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const input = e.target.value;
			if (input.length <= 10) {
				setAccountNumber(input);
				state.values.AccountNumber = input;
			}
			if (input.length === 10 && state.values.BankCode) {
				confirmAccount();
			}
		},
		[confirmAccount, state.values],
	);

	return (
		<section className="flex-col flex gap-1.5 lg:gap-3 p-3 lg:p-4 w-full md:w-2/3  mx-auto ">
			<p className="text-lg lg:text-2xl/none -tracking-wider font-bold">Enter your bank details </p>
			<p className="text-sm font-normal">Add a bank account to start receiving payment.</p>
			<div className="flex flex-col gap-3">
				<div className="p-2 bg-gray-50 rounded-lg  focus-within:border-2 focus-within:border-red-700">
					<input
						value={accountNumber}
						onChange={handleAccountNumberChange}
						type="text"
						className="bg-transparent w-full text-sm focus:border-none outline-none"
						placeholder="Your Account Number"
					/>
				</div>

				<Select onValueChange={handleBankSelect}>
					<SelectTrigger className="w-[full]">
						<SelectValue placeholder="Select Bank" />
					</SelectTrigger>
					<SelectContent>
						{banks.map((bank) => (
							<SelectItem key={bank.code} value={bank.code}>
								{bank.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			{checking ? (
				<Loader className="mx-auto" />
			) : (
				<p className="text-green-700 font-bold bg-green-100 p-1">
					{personData ? personData.bankAccountName : ''}
				</p>
			)}
			<div className="flex gap-3">
				<Button onClick={skip} variant={'secondary'} className="text-sm lg:text-base">
					Skip
				</Button>
				<Button
					onClick={next}
					className="px-4 lg:px-8 text-sm lg:text-base"
					disabled={personData ? false : true}
				>
					{loading ? <LoadingOutlined /> : 'Proceed'}
				</Button>
			</div>
		</section>
	);
}
