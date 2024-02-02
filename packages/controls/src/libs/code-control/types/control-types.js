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
	height?: string,
	minHeight?: string,
	maxHeight?: string,
	width?: string,
	minWidth?: string,
	maxWidth?: string,
	/**
	 * Enables a placeholder—a piece of example content to show when the editor is empty.
	 */
	placeholder?: string | HTMLElement,
	/**
	 * `light` / `dark`
	 *
	 * @default light
	 */
	theme?: 'light' | 'dark',
	/**
	 * basicSetup by default
	 */
	basicSetup?: CodeControlOptionsTypes,
	/**
	 * This disables editing of the editor content by the user.
	 *
	 * @default true
	 */
	editable?: boolean,
	/**
	 * This disables editing of the editor content by the user.
	 *
	 * @default false
	 */
	readOnly?: boolean,
	/**
	 * Controls whether pressing the `Tab` key inserts a tab character and indents the text (`true`)
	 * or behaves according to the browser's default behavior (`false`).
	 *
	 * @default true
	 */
	indentWithTab?: boolean,
	/**
	 * Description to show after code control
	 */
	description?: any,
};
