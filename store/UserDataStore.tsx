'use client';
import { create } from 'zustand';
import { Profile } from '@prisma/client';
import { Optional } from '@prisma/client/runtime/library';
import { User } from 'lucia';

interface UserDataStore {
	user: Optional<Profile> | null;
	updateUser: (user: Optional<Profile> | null) => void;
	logOut: () => void;
}

export const useUser = create<UserDataStore>((set, get) => ({
	user: null,
	updateUser(updatedUser) {
		//console.log('BEFORE UPDATE USER Updating user:', get().user);
		set({ user: updatedUser });
		//console.log('AFTER UPDATE USER Updating user:', get().user);
	},
	logOut() {
		//console.log('BEFORE Updating user:', get().user);
		set({ user: null });
		//console.log('AFTER Updating user:', get().user);
	},
}));
