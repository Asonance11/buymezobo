'use client';
import React, { useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { usePersonForm } from './UserAfterForm';
import { Button } from '@/components/ui/button';
import { Loader2 as Loader } from 'lucide-react';
import axios from 'axios';
import { debounce } from 'lodash';

export default function UserNameStep() {
	const { nextStep } = useWizard();
	const { state } = usePersonForm();

	const [loading, setLoading] = useState(false);
	const [usernameError, setUsernameError] = useState('');
	const [available, setAvailable] = useState<boolean | null>(null);

	const debouncedCheckUsername = debounce(async (username: string) => {
		try {
			setLoading(true);
			if (username.length == 0) {
				setLoading(false);
				setAvailable(null);
				setUsernameError('');
				return;
			}
			if (username.length < 3) {
				setLoading(false);
				setAvailable(false);
				setUsernameError('Username must be at least 3 characters long');
				return;
			}
			const response = await axios.get(`/api/auth/username?username=${username}`);
			const data = await response.data;
			if (data.available) {
				setLoading(false);
				setUsernameError('');
				setAvailable(true);
				state.values.UserName = username;
			} else {
				setLoading(false);
				setAvailable(false);
				setUsernameError('Username is not available');
			}
		} catch (error) {
			setLoading(false);
			setUsernameError('Error checking username');
		}
	}, 500);

	const handleUsernameChange = (event: any) => {
		event.preventDefault();
		const username = event.target.value;
		debouncedCheckUsername(username);
	};

	const next = () => {
		if (!loading) {
			nextStep();
		}
	};

	return (
		<section className="flex-col flex gap-1.5 lg:gap-3 p-3 lg:p-4 w-full md:w-2/3  mx-auto">
			<p className="text-lg lg:text-2xl/none -tracking-wider font-bold">Choose a username for your page</p>
			<p className="text-sm font-normal">add a username to start recieving payment.</p>

			<div
				className={`gap-0.5 flex items-center w-full border-2 ${
					available === true ? 'border-green-700' : available === false ? 'border-red-700' : 'border-black'
				} rounded-lg p-2.5 bg-gray-100`}
			>
				<p className="font-semibold text-sm lg:text-base">buymezobo.com/</p>

				<input
					onChange={handleUsernameChange}
					type="text"
					className="flex-1 bg-transparent focus:border-none outline-none"
					placeholder={state.values.UserName ? state.values.UserName : 'your name'}
				/>

				{loading ? (
					<div className={''}>
						<Loader className="animate-spin" />
					</div>
				) : null}
			</div>
			{usernameError && <p className="text-red-500 font-semibold text-sm">{usernameError}</p>}
			<div className="flex gap-3">
				<Button onClick={next} disabled={loading} className="px-4 lg:px-8 text-sm lg:text-base">
					Save username
				</Button>
			</div>
		</section>
	);
}
