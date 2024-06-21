'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { NotificationsProvider } from '@/components/Notifications/NotificationInterface';
import SupportWindow from '@/components/Profile/SupportWindow';

// Dynamically import components
const AdminSideMenuNavigationComponent = dynamic(
	() => import('@/components/Navigation/AdminSidebarMenuNavigationSheet'),
	{ ssr: false },
);

const EditProfileImageModal = dynamic(() => import('@/components/Profile/EditProfileImageModal'), { ssr: false });
const EditHeaderImageModal = dynamic(() => import('@/components/Profile/EditHeaderImageModal'), { ssr: false });
const EditUsernamePageModal = dynamic(() => import('@/components/Profile/EditUsernamePageModal'), { ssr: false });
const MakeImagePostModal = dynamic(() => import('@/components/Posts/MakeImagePostModal'), { ssr: false });
const PayoutInfoModal = dynamic(() => import('@/components/Profile/PayoutInfoModal'), { ssr: false });
const PopUpWidgetModal = dynamic(() => import('@/components/ButtonsAndGraphics/PopUpWidgetModal'), { ssr: false });
const QRCodeModal = dynamic(() => import('@/components/ButtonsAndGraphics/QRCodeModal'), { ssr: false });
const SearchCreatorMenu = dynamic(() => import('@/components/Headers/SearchCreators'), { ssr: false });
const SideMenuNavigationComponent = dynamic(() => import('@/components/Navigation/SideMenuNavigationHeader'), {
	ssr: false,
});
const WithdrawPayoutModal = dynamic(() => import('@/components/Profile/WithdrawPayoutModal'), { ssr: false });
const NotificationModal = dynamic(() => import('@/components/Notifications/NotificationModal'), { ssr: false });
const ImageSelectModal = dynamic(() => import('@/components/Posts/ImageSelectModal'), { ssr: false });
const SocialMediaLinkModal = dynamic(() => import('@/components/Profile/SocialMediaLinkModal'), { ssr: false });
const SupportWindow = dynamic(() => import('@/components/Profile/SupportWindow'), { ssr: false });

export function InterfaceProvider() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<EditHeaderImageModal />
			<EditProfileImageModal />
			<NotificationsProvider />
			<PopUpWidgetModal />
			<ImageSelectModal />
			<QRCodeModal />
			<WithdrawPayoutModal />
			<PayoutInfoModal />
			<SearchCreatorMenu />
			<SideMenuNavigationComponent />
			<AdminSideMenuNavigationComponent />
			<EditUsernamePageModal />
			<MakeImagePostModal />
			<NotificationModal />
			<SocialMediaLinkModal />
			<SupportWindow />
		</>
	);
}
