'use client';

import { UploadButton } from '@/utility/uploadthing';
import { Button } from '../ui/button';
import { useState } from 'react';

interface FileUploadProps {
    onChange: (url: string) => void;
    endpoint: "Image"
    value: string | undefined;
    setLoading: (loading: boolean) => any
}

export const ImageUpload = (props: FileUploadProps) => {
    const { onChange, value, endpoint } = props;
    const [image, setImage] = useState(value)

    if (value == "200") {

        return (
            <div className="cursor-pointer rounded-lg w-16 h-14 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${value})` }}></div>
        );
    }

    return (
        <UploadButton

            appearance={{
                button: () => {
                    return {
                        width: "7rem",
                        height: "5rem",
                        outline: "none",
                        margin: "0 0 0 0 ",
                    }
                }
            }}

            content={{
                button: () => {
                    return <div className="cursor-pointer rounded-lg h-full w-full bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${image})` }}></div>
                },
                allowedContent({ isUploading }) {
                    if (isUploading) {
                        return "uploading ..."
                    }
                    return "upload a profile picture"
                },
            }}
            className='w-full'
            endpoint={endpoint}

            onClientUploadComplete={res => {
                setImage(res?.[0].url!);
                onChange(res?.[0].url!);
                props.setLoading(false)
            }}
            onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
                props.setLoading(false)
            }}
            onUploadBegin={name => {
                props.setLoading(true)
            }}
        />
    );
};

//WARN: onbeforeupload begin may be a better choice than onuploadbegin, just docking
