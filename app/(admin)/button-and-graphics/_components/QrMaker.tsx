import { useOrigin } from '@/hooks/useOrigin';
import { getCurrentUser } from '@/lib/authentication';
import { Profile } from '@prisma/client';
import { useEffect, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';

export function QRMaker() {
	const [loggedInUser, setLoggedInUser] = useState<Profile | null>(null);

	const origin = useOrigin();
	useEffect(() => {
		const fetchProfile = async () => {
			const loggedInUser = await getCurrentUser();
			setLoggedInUser(loggedInUser);
		};
		fetchProfile();
	}, []);

	return (
		<QRCode
			value={`${origin}/${loggedInUser?.userName}`}
			size={250}
			qrStyle="dots"
			eyeRadius={10}
			eyeColor={'#7C3BED'}
			// logoImage="/image.png"
			removeQrCodeBehindLogo={true}
			// bgColor="gray"
		/>
	);
}
