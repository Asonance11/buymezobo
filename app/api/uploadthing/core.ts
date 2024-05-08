import { createUploadthing, type FileRouter } from "uploadthing/next";
import { useAuth } from "@clerk/nextjs"
import { db } from "@/lib/database";

const f = createUploadthing();

const handleAuth = () => {
    const { userId } = useAuth()
    if (!userId) throw new Error("Unauthorized")
    return { userId };
}

export const ourFileRouter = {
    Image: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
