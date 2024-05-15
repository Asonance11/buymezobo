import { cn } from '@/utility/style';
import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> { }
export default function Loader({ className }: Props) {
    return (
        <div
            className={cn(
                `border-gray-300 h-8 w-8 animate-spin rounded-full border-[6px] border-t-purple-900`,
                className,
            )}
        />
    );
}
