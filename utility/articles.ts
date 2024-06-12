import { Block, InlineContent, TableContent } from '@/types/blocknote';

function extractTextFromInlineContent(inlineContent: InlineContent): string {
	let text = '';

	if (inlineContent.type === 'text') {
		text += inlineContent.text;
	} else if (inlineContent.type === 'link') {
		inlineContent.content.forEach((content) => {
			text += extractTextFromInlineContent(content);
		});
	}

	return text;
}

function extractTextFromTableContent(tableContent: TableContent): string {
	let text = '';

	tableContent.rows.forEach((row) => {
		row.cells.forEach((cell) => {
			cell.forEach((inlineContent) => {
				text += ` ${extractTextFromInlineContent(inlineContent)}`;
			});
		});
	});

	return text;
}

function extractTextFromBlocks(blocks: Block[]): string {
	let text = '';

	blocks.forEach((block) => {
		console.log('Processing block:', block);
		if (block.content) {
			if (Array.isArray(block.content)) {
				block.content.forEach((inlineContent) => {
					text += ` ${extractTextFromInlineContent(inlineContent)}`;
				});
			} else if (block.content.type === 'tableContent') {
				text += ` ${extractTextFromTableContent(block.content)}`;
			}
		} else {
			console.log('Block has no content:', block);
		}

		if (block.children && block.children.length > 0) {
			text += ` ${extractTextFromBlocks(block.children)}`;
		}
	});

	return text.trim(); // Ensure no leading/trailing whitespace
}

export function calculateReadingTime(blocks: Block[]): number {

    console.log("WORDS PASSED IN     " + blocks)
	// Define the average reading speed (words per minute)
	const wordsPerMinute = 200;

	// Extract text from blocks
	const text = extractTextFromBlocks(blocks);

	// Debug: log the extracted text
	console.log('Extracted text:', text);

	// Strip any remaining HTML tags and count the words
	const plainText = text.replace(/<\/?[^>]+(>|$)/g, '');
	const wordCount = plainText.split(/\s+/).filter((word: string) => word.length > 0).length;

	// Debug: log the word count
	console.log('Word count:', wordCount);

	// Calculate reading time
	const readingTime = Math.ceil(wordCount / wordsPerMinute);

	return readingTime;
}
