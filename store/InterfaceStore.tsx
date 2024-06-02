'use client';

import { Post, Profile } from '@prisma/client';
import { User } from 'lucia';
import { create } from 'zustand';

export type InterfaceType =
    | 'searchCreators'
    | 'sideMenuNavigation'
    | 'adminSideMenuNavigation'
    | 'editUsernamePage'
    | 'payoutInfoModal'
    | 'withdrawPayoutModal'
    | 'makeImagePostModal'
    | 'imageSelectModal'
    | 'popupWidgetModal'
    | 'notifications'
    | 'socialMediaLinksModal'

    //Buttons and widget modal
    | 'QRCodeModal';

export interface InterfaceDataType {
    creator?: User | null;
    profile?: Profile; // can be used in the place of creator, just to not create breaking changes yet, will fix soon
    post?: Post;
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
