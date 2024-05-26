import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FaqAccordionProps {
	index: number;
	question: string;
	answer: string;
}

const FaqAccordionItem = ({ index, question, answer }: FaqAccordionProps) => {
	return (
		<AccordionItem value={index.toString()} className="border-none bg-neutral-100 rounded-md px-4 mb-4">
			<AccordionTrigger className="font-semibold text-start text-sm lg:text-base">{question}</AccordionTrigger>
			<AccordionContent className="text-xs font-light lg:text-base">{answer}</AccordionContent>
		</AccordionItem>
	);
};

export default FaqAccordionItem;
