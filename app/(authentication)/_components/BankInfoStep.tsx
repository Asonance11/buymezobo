import React from 'react'
import { useWizard } from 'react-use-wizard';
import { usePersonForm } from './UserAfterForm';
import { Button } from '@/components/ui/button';

export default function BankInfoStep() {
    const { previousStep, nextStep } = useWizard();
    const { register } = usePersonForm()
    return (
        <section className='bg-pink-500 flex flex-col  gap-3 p-5'>
            <input type="text" placeholder="" {...register("AccountNumber")} />
            <input type="text" placeholder="" {...register("BankCode")} />
            <Button type="reset">Reset</Button>
            <Button onClick={previousStep}>Back</Button>
            <Button onClick={nextStep}>Next</Button>
        </section>
    )
}

