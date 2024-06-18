'use client';
import '@blocknote/core/fonts/inter.css';
import { useCreateBlockNote as CreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { Block, BlockNoteSchema, filterSuggestionItems, insertOrUpdateBlock } from '@blocknote/core';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { DragHandleButton, SideMenu, SideMenuController, useCreateBlockNote } from '@blocknote/react';

interface EditorProps {
	readOnly?: boolean;
	onEditorChange?: (value: any) => void;
	initialValues?: any;
	previewMode?: boolean;
}

export default function Editor({ initialValues, onEditorChange, previewMode = false, readOnly = false }: EditorProps) {
	const onChange = async () => {
		const html = await editor.blocksToHTMLLossy(editor.document);
		//@ts-ignore
		if (onEditorChange) {
			onEditorChange(editor.document);
		}
	};

	let editor: any;

	if (initialValues && initialValues.length > 0) {
		editor = CreateBlockNote({
			initialContent: initialValues,
			domAttributes: {
				editor: {
					style: 'padding-inline: 15px;',
				},
			},
		});
	} else {
		editor = CreateBlockNote({});
	}

	if (previewMode && !initialValues) {
		return null;
	}

	return (
		<BlockNoteView
			sideMenu={false}
			//editable={!readOnly}
			editor={editor}
			onChange={onChange}
			theme="light"
			data-theming-css-demo
		>
		</BlockNoteView>
	);
}
