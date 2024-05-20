import React, { HTMLAttributes } from 'react';
import { DancingScript, shadowLight } from '@/utility/fonts';
import { cn } from '@/utility/style';

interface Props extends HTMLAttributes<HTMLDivElement> {
    textClassName?: string;
}

export const Logo = ({ className, textClassName }: Props) => {
    return (
        <a href="/">
            <div className={cn(` flex items-center justify-center gap-0.5`, className)}>
                <p
                    className={cn(
                        `text-2xl lg:text-3xl tracking-tighter font-extrabold ${shadowLight.className}`,
                        textClassName,
                    )}
                >
                    Buy me Zobo &copy;
                </p>
            </div>
        </a>
    );
};
