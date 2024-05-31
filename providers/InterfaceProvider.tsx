'use client';

import { AdminSideMenuNavigationComponent } from '@/components/Interface/AdminSidebarMenuNavigationSheet';
import EditUsernamePageModal from '@/components/Profile/EditUsernamePageModal';
import ImageSeclectModal from '@/components/Interface/ImageSelectModal';
import { MakeImagePostModal } from '@/components/Posts/MakeImagePostModal';
import PayoutInfoModal from '@/components/Profile/PayoutInfoModal';
import PopUpWidgetModal from '@/components/ButtonsAndGraphics/PopUpWidgetModal';
import QRCodeModal from '@/components/ButtonsAndGraphics/QRCodeModal';
import { SearchCreatorMenu } from '@/components/Interface/SearchCreators';
import { SideMenuNavigationComponent } from '@/components/Interface/SideMenuNavigationHeader';
import WithdrawPayoutModal from '@/components/Profile/WithdrawPayoutModal';
import { NotificationsProvider } from '@/components/Notifications/NotificationInterface';
import { useEffect, useState } from 'react';
import NotificationModal from '@/components/Notifications/NotificationModal';
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
			<NotificationsProvider />
			<PopUpWidgetModal />
			<ImageSeclectModal />
			<QRCodeModal />
			<WithdrawPayoutModal />
			<PayoutInfoModal />
			<SearchCreatorMenu />
			<SideMenuNavigationComponent />
			<AdminSideMenuNavigationComponent />
			<EditUsernamePageModal />
			<MakeImagePostModal />
			<NotificationModal />
		</>
	);
}
