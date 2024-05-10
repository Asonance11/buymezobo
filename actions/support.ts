"use server"
import { db } from "@/lib/database";
import { Support } from "@prisma/client";


export async function getCreatorSupports(creatorId: string, take?: number): Promise<[Support[], Error | null]> {

    try {
        const supports = await db.support.findMany({
            where: {
                profileId: creatorId
            },
            take: take ? take : 10
        })

        return [supports, null]

    } catch (error) {
        console.log(error)
        return [[], error as Error]
    }

}
