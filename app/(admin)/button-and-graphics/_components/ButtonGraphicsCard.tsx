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
		<div className="grid md:grid-cols-1 lg:grid-cols-2 place-items-stretch gap-4 lg:gap-7 xl:gap-9 ">
			{mainOptions.map((option, index) => (
				<Card key={index} className=" text-center py-3 rounded-xl shadow-md">
					<CardHeader className="space-y-2 ">
						<Image
							src={option.image}
							width={180}
							height={100}
							alt={option.title}
							className="object-cover mx-auto cursor-pointer"
						/>
					</CardHeader>
					<CardContent className="p-0 my-3 space-y-2">
						<CardTitle className="text-2xl font-semibold">{option.title}</CardTitle>
						<CardDescription className="w-3/4 mx-auto text-zinc-900 text-sm">
							{option.description}
						</CardDescription>
					</CardContent>
					<CardFooter className="flex justify-center ">
						<button className="border border-zinc-900 py-2 px-5 rounded-3xl text-sm font-semibold hover:-translate-y-1 transition-all duration-100">
							{option.action}
						</button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
};

export default ButtonGraphicsCard;
