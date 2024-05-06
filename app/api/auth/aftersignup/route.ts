import { db } from "@/lib/database";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json()
    console.log(data)

    try {

        const profile = await currentUser()

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        //TODO: create and save a transfer recipient https://paystack.com/docs/transfers/creating-transfer-recipients/#create-recipient

        const updated = await db.profile.update({
            where: {
                id: profile.id
            },
            data: {
                accountNumber: data.accountNumber,
                userName: data.userName,
                bankCode: data.bankCode
            }
        })

        if (!updated) {
            throw new Error("Unauthorized")
        }

        return new NextResponse("okay", { status: 200 })

    } catch (err) {

        return new NextResponse("SERVER ERROR, POST AFTER SIGNUP", { status: 500 })
    }
}
