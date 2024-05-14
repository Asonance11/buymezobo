import { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface Option {
	title: string;
	image: string;
	description: string;
	action: string;
}

interface Props {
	mainOptions: Option[];
}

const ButtonGraphicsCard: FC<Props> = ({ mainOptions }) => {
	return (
		<div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
			{mainOptions.map((option, index) => (
				<Card key={index} className="mb-5 text-center">
					<CardHeader>
						<Image
							src={option.image}
							width={336}
							height={150}
							alt={option.title}
							className="object-cover mx-auto cursor-pointer"
						/>
						<CardTitle className="text-4xl font-semibold">{option.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<CardDescription className="text-black text-md">{option.description}</CardDescription>
					</CardContent>
					<CardFooter className="flex justify-center">
						<button className="border border-black py-2 px-4 rounded-3xl text-lg font-semibold hover:-translate-y-1 transition-all duration-100">
							{option.action}
						</button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
};

export default ButtonGraphicsCard;
