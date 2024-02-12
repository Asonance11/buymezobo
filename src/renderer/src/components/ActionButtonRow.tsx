import React, { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { LuFileSignature } from 'react-icons/lu'
import { FaRegTrashCan } from 'react-icons/fa6'

export const ActionButtonRow = ({ ...props }: ComponentProps<'div'>) => {
    return (
        <div {...props}>
            <Button>
                <LuFileSignature className='w-4 h-4 text-zinc-300' />
            </Button>

            <Button>
                <FaRegTrashCan className='w-4 h-4 text-zinc-300' />
            </Button>
        </div>
    )
}
