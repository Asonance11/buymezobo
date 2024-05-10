//import { getCurrentUser } from "@/lib/authentication";
import { db } from "@/lib/database";
import { PaymentStatus, Support } from "@prisma/client";
import { Optional } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {

        const support: Optional<Support> = await request.json()

        if (!support) {
            return new NextResponse("Bad request", { status: 401 });
        }

        console.table(support)

        const response = await db.support.create({
            data: {
                profileId: support?.profileId!,
                name: support.name ? support.name : "Someone",
                anonymous: support.anonymous,
                content: support.content ? support.content : "",
                amount: support.amount!,
                numberOfZobo: support.numberOfZobo!,
                paymentStatus: PaymentStatus.COMPLETED,
                paymentRef: support.paymentRef,

            }
        })

        return new NextResponse(JSON.stringify(response), { status: 200 });

    } catch (error) {
        console.error('[SERVER CREATE SUPPORT ERROR]', error);
        return new NextResponse('Internal Server Error', {
            status: 500,
        });
    }
}
