// @flow
/**
 * External dependencies
 */
import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';

/**
 * Internal dependencies
 */
import type { ThemeOptions } from '../types';

export const createTheme = ({
	variant,
	settings,
	styles,
}: ThemeOptions): Object => {
	const theme = EditorView.theme(
		{
			'&': {
				backgroundColor: settings.background + ' !important',
				color: settings.foreground,
				fontSize: settings.fontSize,
				fontFamily: settings.fontFamily,
				borderRadius: '2px',
			},
			'.cm-scroller': {
				fontSize: settings.fontSize,
				fontFamily: settings.fontFamily,
			},
			'.cm-content': {
				caretColor: settings.caret,
			},
			'.cm-cursor, .cm-dropCursor': {
				borderLeftColor: settings.caret,
			},
			'&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
				{
					backgroundColor: settings.selection + ' !important',
				},
			'.cm-activeLine': {
				backgroundColor: settings.lineHighlight,
			},
			'.cm-gutters': {
				backgroundColor: settings.gutterBackground,
				color: settings.gutterForeground,
			},
			'.cm-lineNumbers .cm-activeLineGutter': {
				backgroundColor:
					settings.gutterActiveBackground + ' !important',
			},
			'&.cm-focused': {
				outline: settings.focused + ' !important',
			},
		},
		{
			dark: variant === 'dark',
		}
	);

	const highlightStyle = HighlightStyle.define(styles);

	return [theme, syntaxHighlighting(highlightStyle)];
};
