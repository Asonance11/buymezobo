'use client'

import { create } from 'zustand';

export type InterfaceType =
    | 'searchCreators'
    | 'sideMenuNavigation'

interface InterfaceStore {
    type: InterfaceType | null;
    isOpen: boolean;
    onOpen: (type: InterfaceType) => void;
    onClose: () => void;
}

export const useInterface = create<InterfaceStore>(set => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen(type: InterfaceType) {
        set({ isOpen: true, type });
    },
    onClose() {
        set({ isOpen: false, type: null });
    },

}));
