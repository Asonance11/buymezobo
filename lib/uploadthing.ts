import {
    generateUploadButton,
    generateUploadDropzone,
} from "@uploadthing/react";
import { UTApi } from "uploadthing/server"

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import axios from "axios";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export async function DeleteFileFromUploadthing(imageUrl: string | undefined | null): Promise<void> {
    if (imageUrl === undefined || imageUrl === null) {
        return
    }
    try {
        const url = "/api/uploadthing?imageUrl=" + imageUrl;
        await axios.delete(url)
        console.log("IMAGE HAS BEEN DELETETED")
    } catch (error) {
        console.log(error) //NOTE:we can do something here, like store the url, and use to workers to keep deleting unused files
        return
    }

}
