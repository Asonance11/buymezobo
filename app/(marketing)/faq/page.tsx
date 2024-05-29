import FaqAccordionItem from '@/components/MarketingComponents/faq-accordion';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { faqs } from '@/data/faq';
import { DancingScript, helvetica } from '@/utility/fonts';
import Link from 'next/link';
import React, { Suspense } from 'react';

const FaqPage = () => {
    return (
        <section className="mt-4 md:mt-16 lg:mt-24 p-4 flex flex-col gap-5 justify-center mx-auto max-w-4xl mmd:max-w-3xl ">
            <section className="">
                <div className="text-center">
                    <h1 className={`${helvetica.className} text-2xl lg:text-3xl font-bold tracking-tight`}>
                        Frequently Asked Questions
                    </h1>
                    <p className=" mt-3 lg:mt-4 text-sm lg:text-base font-light text-center mx-auto w-full lg:w-2/3">
                        If you can&apos;t find an answer that you&apos;re looking for, feel free to drop us a line,
                        we will try to update this as much as we can
                    </p>
                </div>
                <div className="mt-4 flex items-center justify-center gap-x-5">
                    <Link href="/about">
                        <Button variant={'outline'} className="font-semibold border-purple-400 text-zinc-700 ">
                            About the company
                        </Button>
                    </Link>
                    <Link href="mailto:gbemilesanmi@gmail.com">
                        <Button variant={'outline'} className="font-semibold border-purple-400 text-zinc-700 ">
                            Contact support
                        </Button>
                    </Link>
                </div>
            </section>

            <section className="p-3 w-full lg:w-3/4 mx-auto">
                {faqs.map((faq, index) => (
                    <Accordion type="multiple" key={index}>
                        <FaqAccordionItem index={index} question={faq.question} answer={faq.answer} />
                    </Accordion>
                ))}
            </section>
        </section>
    );
};

export default FaqPage;
