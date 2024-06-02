import { cn } from '@/utility/style';
import { SocialMediaLink, SocialMediaType } from '@prisma/client';
import { HTMLAttributes } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaLink } from 'react-icons/fa';

const icons = (type: SocialMediaType) => {
	switch (type) {
		case 'FACEBOOK':
			return FaFacebook;
		case 'TWITTER':
			return FaTwitter;
		case 'INSTAGRAM':
			return FaInstagram;
		case 'LINKEDIN':
			return FaLinkedin;
		case 'YOUTUBE':
			return FaYoutube;
		default:
			return FaLink;
	}
};

interface Props extends HTMLAttributes<HTMLAnchorElement> {
	link: SocialMediaLink;
	iconClassName?: string;
}

export function SocialMediaIcon({ link, iconClassName, ...opts }: Props) {
	let Icon = icons(link.type);
	return (
		<a href={link.url} {...opts} target="_blank">
			<Icon className={cn('', iconClassName)} />
		</a>
	);
}
