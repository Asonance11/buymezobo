import { useInterface } from '@/store/InterfaceStore';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Loader from '../common/Loader';
import { getCurrentUser } from '@/lib/authentication';
import { Profile } from '@prisma/client';
import { toast } from 'sonner';
import { formatNumberWithCommas } from '@/utility/text';


        console.table(data);

        try {
            setLoading(true);
            const response = await axios.post('/api/support/withdraw', data);

            const responseData = response.data;

            if (!responseData.status) {
                throw new Error('Failed to transfer money');
            }
            toast.success('Withdraw successful');
        } catch (err) {
            console.error('Error with payout:', err);
            toast.error(`Error with payout: ${err}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-4">
                {loading ? (
                    <Loader className="w-[30px] h-[30px] mx-auto block" />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Payout for {profile?.firstName}?</DialogTitle>
                            <DialogDescription>
                                how much do you want to withdraw from a balance of {profile?.balance}{' '}
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="Amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="number" className="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button disabled={loading} type="submit" className="bg-purple-900">
                                    Checkout
                                </Button>
                            </form>
                        </Form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
