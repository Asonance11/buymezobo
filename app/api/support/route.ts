import { Support } from "@prisma/client";
import { Optional } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const updatedProfile: Optional<Support> = await request.json()

    } catch (error) {
        console.error('[SERVER CREATE SUPPORT ERROR]', error);
        return new NextResponse('Internal Server Error', {
            status: 500,
        });
    }
}
