"use client"
import { createForm } from '@createform/react';
import { Wizard } from 'react-use-wizard';
import UserNameStep from './UserNameStep';
import BankInfoStep from './BankInfoStep';

export const usePersonForm = createForm({
    initialValues: {
        UserName: '',
        AccountNumber: '',
        BankCode: '',
    },
});

export function UserAfterform() {
    const form = usePersonForm()

    function handleSubmit(e: any) {
        console.log(e);
    }

    function handleReset(e: any) {
        console.log(e);
    }


    return (
        <form
            onReset={form.handleReset(handleReset)}
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full'
        >
            <Wizard>
                <UserNameStep />
                <BankInfoStep />
            </Wizard>
        </form>
    )

}
