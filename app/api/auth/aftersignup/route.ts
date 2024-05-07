import { getCurrentUser } from "@/lib/authentication";
import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json()

    try {

        const profile = await getCurrentUser()

        if (!profile) {
            return new NextResponse("User is not authenticated", { status: 401 });
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

        return new NextResponse("Bank details saved successfully", { status: 200 });

    } catch (err) {
        console.log("SERVER ERROR, POST AFTER SIGNUP", { status: 500 })
        return new NextResponse("Server error occurred", { status: 500 });
    }
}
