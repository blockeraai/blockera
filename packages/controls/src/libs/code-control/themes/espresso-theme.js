// @flow
/**
 * External dependencies
 */
import { tags as t } from '@lezer/highlight';

/**
 * Internal dependencies
 */
import { createTheme } from './create-theme';

export const espressoLightTheme: Object = createTheme({
	variant: 'light',
	settings: {
		fontSize: '13px',
		fontFamily: 'Menlo, Consolas, DejaVu Sans Mono, monospace',
		background: '#c0d7e524',
		foreground: '#000000',
		caret: '#000000',
		selection: '#c2e8ff',
		gutterBackground: '#ebf5fc',
		gutterForeground: '#2f6f9fa6',
		gutterActiveBackground: '#95d1f475',
		lineHighlight: '#c2e8ff75',
		focused: '2px solid var(--publisher-controls-primary-color)',
	},
	styles: [
		{
			tag: t.comment,
			color: '#8e8e8e',
		},
		{
			tag: t.variableName,
			color: '#2F6F9F',
		},
		{
			tag: [t.string],
			color: '#CF4F5F',
		},
		{
			tag: [t.className],
			color: '#1d6fad',
		},
		{
			tag: [t.propertyName],
			color: '#D83A35',
		},
	],
});
