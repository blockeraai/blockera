// @flow

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type CodeControlOptionsTypes = {
	lineNumbers?: boolean,
	highlightActiveLineGutter?: boolean,
	highlightSpecialChars?: boolean,
	history?: boolean,
	foldGutter?: boolean,
	drawSelection?: boolean,
	dropCursor?: boolean,
	allowMultipleSelections?: boolean,
	indentOnInput?: boolean,
	syntaxHighlighting?: boolean,
	bracketMatching?: boolean,
	closeBrackets?: boolean,
	autocompletion?: boolean,
	rectangularSelection?: boolean,
	crosshairCursor?: boolean,
	highlightActiveLine?: boolean,
	highlightSelectionMatches?: boolean,
	closeBracketsKeymap?: boolean,
	defaultKeymap?: boolean,
	searchKeymap?: boolean,
	historyKeymap?: boolean,
	foldKeymap?: boolean,
	completionKeymap?: boolean,
	lintKeymap?: boolean,
};

export type CodeControlProps = {
	...ControlGeneralTypes,
	/**
	 * Language
	 *
	 * @default 'css'
	 */
	lang?: 'css' | 'javascript',
	defaultValue?: string,
	width?: string,
	height?: string,
	/**
	 * Enables a placeholder—a piece of example content to show when the editor is empty.
	 */
	placeholder?: any,
	/**
	 * This disables editing of the editor content by the user.
	 *
	 * @default true
	 */
	editable?: boolean,
	/**
	 * Description to show after code control
	 */
	description?: any,
};
