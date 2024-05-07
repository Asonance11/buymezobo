"use server"
import { Profile } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./database";

//------------------------------------------------------------------------------------------------

//INFO: if someone is signed in and the profile has not been created in the db, create it.
export async function createInitialProfile(): Promise<Profile | null> {

    const user = await currentUser()

    if (user == null) {
        return null //INFO: means user needs to sign in
    }

    let profile = await getUserbyId(user?.id)

    if (profile) {
        return profile; //INFO: return the profile don't worry
    }

    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            firstName: user.firstName!,
            lastName: user.lastName!,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        },
    });

    return newProfile; // done
}

//INFO: tell us if the user has a set username or not
export async function hasUserName(): Promise<boolean> {
    const profile = await getCurrentUser()

    if (!profile) {
        return false
    }

    if (!profile.userName) {
        return false
    }

    if (profile.userName?.length < 3) {
        return false
    }

    return true
}

//INFO: get the user currently signed in from database, if return null, no user is signed in
export async function getCurrentUser(): Promise<Profile | null> {

    const { userId } = auth();

    if (!userId) {
        return null
    }

    return getUserbyId(userId)

}

//INFO: foundation function to get user by id
export async function getUserbyId(userId: string | undefined): Promise<Profile | null> {

    if (!userId) {
        return null;
    }

    let profile: Profile | null = null

    try {
        profile = await db.profile.findUnique({
            where: {
                userId,
            },
        })
    } catch (error) {
        console.error('Error in Get Profile by ID Function! : ', error);
    }

    return profile
}
