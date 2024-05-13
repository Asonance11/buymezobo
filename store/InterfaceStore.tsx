'use client';

import { Profile } from '@prisma/client';
import { create } from 'zustand';

export type InterfaceType = 'searchCreators' | 'sideMenuNavigation' | 'editUsernamePage' | 'payoutInfoModal';

interface InterfaceDataType {
	creator?: Profile;
}

interface InterfaceStore {
	type: InterfaceType | null;
	data: InterfaceDataType;
	isOpen: boolean;
	onOpen: (type: InterfaceType, data?: InterfaceDataType) => void;
	onClose: () => void;
}

export const useInterface = create<InterfaceStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen(type: InterfaceType, data = {}) {
		set({ isOpen: true, type, data });
	},
	onClose() {
		set({ isOpen: false, type: null });
	},
}));
