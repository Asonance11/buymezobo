import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const dateFormatter = new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'UTC'
})

export const formatDateFromMs = (ms: number) => dateFormatter.format(ms)
