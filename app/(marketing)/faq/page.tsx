import FaqAccordionItem from '@/components/MarketingComponents/faq-accordion';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { faqs } from '@/data/faq';
import { DancingScript } from '@/utility/fonts';
import Link from 'next/link';
import React, { Suspense } from 'react';

const FaqPage = () => {
	return (
		<section className="mt-4 md:mt-16 lg:mt-24 px-4 flex flex-col justify-center mx-auto md:max-w-3xl pb-12">
			<div className="text-center">
				<h1 className={`${DancingScript.className} text-4xl md:text-5xl font-bold`}>
					Frequently Asked Questions
				</h1>
				<p className="mt-6 text-sm xl:text-lg">
					If you can&apos;t find an answer that you&apos;re looking for, feel free to drop us a line.
				</p>
			</div>
			<div className="mt-6 flex items-center justify-center gap-x-4">
				<Link href="/about">
					<Button
						variant="outline"
						className="font-semibold border-2 text-sm border-black transition-transform duration-300 rounded-full hover:bg-transparent hover:scale-105"
					>
						About the company
					</Button>
				</Link>
				<Link href="">
					<Button
						variant="outline"
						className="font-semibold border-2 text-sm border-black transition-transform duration-300 rounded-full hover:bg-transparent hover:scale-105"
					>
						Contact support
					</Button>
				</Link>
			</div>

			<section className="mt-16">
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
