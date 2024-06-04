import dynamic from 'next/dynamic';

import { EmojiStyle, Theme, EmojiClickData } from 'emoji-picker-react';
const EmojiPicker = dynamic(
	() => {
		return import('emoji-picker-react');
	},
	{ ssr: false },
);

interface Props {
	onEmojiClick: (emojiData: EmojiClickData, event: MouseEvent) => void;
	open: boolean;
}

export default function Emoji({ open, onEmojiClick }: Props) {
	return (
			<EmojiPicker
				onEmojiClick={onEmojiClick}
				emojiStyle={EmojiStyle.APPLE}
				theme={Theme.LIGHT}
				open={open}
			/>
	);
}
