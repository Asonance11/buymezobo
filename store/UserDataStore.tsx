'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Optional } from '@prisma/client/runtime/library';
import { User } from 'lucia';

interface UserDataStore {
	loggedInUser: Optional<User> | null;
	updateUser: (user: Optional<User> | null) => void;
	logOut: () => void;
}

export const useUser = create<UserDataStore>()(
	persist(
		(set, get) => ({
			loggedInUser: null,
			updateUser: (updatedUser) => {
				//console.log('BEFORE UPDATE USER Updating user:', get().user);
				set({ loggedInUser: updatedUser });
				//console.log('AFTER UPDATE USER Updating user:', get().user);
			},
			logOut: () => {
				//console.log('BEFORE Updating user:', get().user);
				set({ loggedInUser: null });
				//console.log('AFTER Updating user:', get().user);
			},
		}),
		{
			name: 'user-storage', // name of item in the storage (must be unique)
			storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
			partialize: (state) => ({ loggedInUser: state.loggedInUser }),
		},
	),
);
