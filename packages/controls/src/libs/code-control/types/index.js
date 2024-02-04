// @flow

export * from './control-types';

type ThemeVariant = 'light' | 'dark';

export type ThemeOptions = {
	/**
	 * Theme variant. Determines which styles CodeMirror will apply by default.
	 */
	variant: ThemeVariant,
	/**
	 * Settings to customize the look of the editor, like background, gutter, selection and others.
	 */
	settings: ThemeSettings,
	/**
	 * Syntax highlighting styles.
	 */
	styles: Array<any>,
};

export type ThemeSettings = {
	/**
	 * Editor background.
	 */
	background: string,
	/**
	 * Editor font size.
	 */
	fontSize: string,
	/**
	 * Editor font family.
	 */
	fontFamily: string,
	/**
	 * Default text color.
	 */
	foreground: string,
	/**
	 * Caret color.
	 */
	caret: string,
	/**
	 * Selection background.
	 */
	selection: string,
	/**
	 * Background of highlighted lines.
	 */
	lineHighlight: string,
	/**
	 * Gutter background.
	 */
	gutterBackground: string,
	/**
	 * Text color inside gutter.
	 */
	gutterForeground: string,
	/**
	 * Current line active gutter background.
	 */
	gutterActiveBackground: string,
	/**
	 * Editor focused color.
	 */
	focused: string,
};
