import { FC } from 'react';
import ButtonGraphicsCard from './_components/ButtonGraphicsCard';
import { InterfaceDataType, InterfaceType } from '@/store/InterfaceStore';

export interface ButtonOption {
	title: string;
	image: string;
	description: string;
	action: string;
	type?: InterfaceType;
	data?: InterfaceDataType;
}

const mainOptions: ButtonOption[] = [
	// {
	// 	title: 'Website Buttons',
	// 	image: '/image.png',
	// 	description:
	// 		'Craft personalized buttons for your websites or blog to guide your visitors to your "Buy Me Zobo" page.',
	// 	action: 'Get Crafting',
	// },
	{
		title: 'Website Widgets',
		image: '/image.png',
		description:
			'Enable your visitors to support you with Zobo directly from your website. Personalize the widget with your own message and brand color scheme.',
		action: 'Create Widget',
		type: 'popupWidgetModal',
	},
	{
		title: 'QR Code',
		image: '/image.png',
		description:
			'Quick and modern way to receive appreciation from your fans. Use it on your business card, website, or social media.',
		action: 'Generate QR Code',
		type: 'QRCodeModal',
	},
];

const subOptions: ButtonOption[] = [
	// {
	// 	title: 'Website Badge',
	// 	image: '/image.png',
	// 	description:
	// 		'Add a "Buy Me Zobo" badge to your website. Let your visitors know they can support you with a bottle of Zobo.',
	// 	action: 'Add to Website',
	// },
];

const Button: FC = () => {
	return (
		<section className="mt-4 md:mt-10 flex justify-center mx-auto pb-12">
			<main className="w-4/5 lg:w-2/3">
				<div className="mb-10">
					<h1 className="font-bold text-xl mb-5">Buttons & Graphics</h1>
					<div className="">
						<ButtonGraphicsCard mainOptions={mainOptions} />
					</div>
				</div>
				{subOptions.length > 0 && (
					<div className="mb-10">
						<h1 className="font-bold text-xl mb-5">Images & Shareables</h1>
						<div className="">
							<ButtonGraphicsCard mainOptions={subOptions} />
						</div>
					</div>
				)}
			</main>
		</section>
	);
};

export default Button;
