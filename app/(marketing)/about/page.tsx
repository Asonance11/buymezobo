/* eslint-disable react/no-unescaped-entities */
import { AboutLocationButton } from '@/components/MarketingComponents/AboutButtonLocation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DancingScript, fontSans, helvetica, shadowLight } from '@/utility/fonts';
import { Metadata } from 'next';
import { MdOutlineLocationOn } from 'react-icons/md';

export const metadata: Metadata = {
	title: 'About - Buy Me Zobo',
	description: 'Learn more about Buy Me Zobo, our features, and our goal',
};

const AboutPage = () => {
	return (
		<main className="mt-4 md:mt-16 lg:mt-20 px-4 gap-6 flex flex-col justify-center mx-auto md:max-w-3xl pb-12 items-center ">
			<Button variant={'outline'} className="w-fit my-1  py-0.5 px-1.5">
				<MdOutlineLocationOn className="xl" />
				<hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />
				<p className="text-xs">Lagos, NG</p>
			</Button>

			<div className=" flex flex-col items-center gap-3">
				<h1
					className={` ${helvetica.className} text-2xl lg:text-4xl text-center font-bold w-full lg:w-5/6 mx-auto `}
				>
					Get Paid for Your Nigerian Creativity, No 'Uncles' Needed!
				</h1>
				<span className="flex items-center text-gray-500 font-light text-center">
					<p className="text-sm">2 min</p>
					<hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />
					<p className="text-sm">Read time</p>
				</span>
			</div>

			<section className="rounded-xl bg-white w-full mx-auto lg:w-3/4 border border-zinc-300">
				<div className="text-left border-b border-zinc-300 py-2 lg:py-4 px-3 lg:px-8">
					<h1 className={`${helvetica.className} text-base lg:text-xl font-semibold`}>Our Gist</h1>
				</div>
				<div
					className={`${fontSans.className} text-sm lg:text-base font-normal text-justify pv-1 lg:py-3 px-3 lg:px-8`}
				>
					<p className="mt-4 mb-3 xl:mb-5">
						We're firm believers that every Nigerian has a creator within them. Our mission is to support as
						many Nigerian creators in unlocking their full potential and effortlessly earning from their
						creativity.
					</p>
					<p>
						Our Goal? Ditch the stress, simplify "appreciations", and foster genuine connections between
						creators and their fans. But guess what? Simple just won't cut it. Creators craved something
						more than just ease-of-use; a platform that resonated with meaning and sparked joy. And so, we
						set out to design a payment experience that goes beyond mere transactions."
					</p>
					<p className="mt-6">
						Ever heard the joke about the Nigerian creator who walked into a bar? Neither have we, because
						they were too busy crafting their next masterpiece! At our core, we're all about turning
						creativity into cash, so you can say goodbye to those days of relying on ads that vanish quicker
						than NEPA power. With Buy Me a Coffee... oops, I mean Buy Me Zobo, Nigerian creators can finally
						sip on success, one grateful fan at a time. It's time to turn those creative sparks into Naira
						bills, because why settle for just dreams when you can have your own fan-funded reality show?
						Let's paint the town green, white, green with creativity, one sip at a time!
					</p>
				</div>
			</section>
			<div className="flex mt-8">
				<p className={`text-2xl lg:text-3xl tracking-tighter italic select-none ${shadowLight.className}`}>
					BMZteam
				</p>
			</div>
		</main>
	);
};

export default AboutPage;
