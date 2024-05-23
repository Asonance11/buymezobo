'use client';

import { AdminSideMenuNavigationComponent } from '@/components/Interface/AdminSidebarMenuNavigationSheet';
import EditUsernamePageModal from '@/components/Interface/EditUsernamePageModal';
import ImageSeclectModal from '@/components/Interface/ImageSelectModal';
import { MakeImagePostModal } from '@/components/Interface/MakeImagePostModal';
import PayoutInfoModal from '@/components/Interface/PayoutInfoModal';
import PopUpWidgetModal from '@/components/Interface/PopUpWidgetModal';
import QRCodeModal from '@/components/Interface/QRCodeModal';
import { SearchCreatorMenu } from '@/components/Interface/SearchCreators';
import { SideMenuNavigationComponent } from '@/components/Interface/SideMenuNavigationHeader';
import WithdrawPayoutModal from '@/components/Interface/WithdrawPayoutModal';
import { useEffect, useState } from 'react';
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
		</>
	);
}
