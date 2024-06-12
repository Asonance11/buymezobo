export type Block = {
	id: string;
	type: string;
	props: Record<string, boolean | number | string>;
	content: InlineContent[] | TableContent | undefined;
	children: Block[];
};

type Link = {
	type: 'link';
	content: StyledText[];
	href: string;
};

type StyledText = {
	type: 'text';
	text: string;
	styles: string;
};

export type InlineContent = Link | StyledText;

export type TableContent = {
	type: 'tableContent';
	rows: {
		cells: InlineContent[][];
	}[];
};
