import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
    const url = new URL(req.url)
    const username = url.searchParams.get('username')

    if (username == "siji") {
        return NextResponse.json({ available: false })
    }

    const available = db.profile.findFirst({
        where: {
            username
        }
    })

    if (available != null) {
        return NextResponse.json({ available: true })
    }

    return NextResponse.json({ available: false })
}
