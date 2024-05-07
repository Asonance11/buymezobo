"use server"

import { Profile } from "@prisma/client"
import { db } from "./database"

export async function getCreatorByName(name: string): Promise<Profile | null> {

    try {

        const creator = await db.profile.findFirst({
            where: {
                userName: name
            }
        })

        return creator
        
    } catch (error) {
       return null 
    }

} 
