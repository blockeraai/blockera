// @flow
/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

export const getFontSizes = (): Array<{
	name: string,
	slug: string,
	size: string,
}> => {
	return getBlockEditorSettings().fontSizes;
};

export const getFontSize = (
	slug: string
): ?{
	name: string,
	slug: string,
	size: string,
} => {
	return getFontSizes().find((item) => item.slug === slug);
};

export const getFontSizeBy = (
	field: string,
	value: any
): ?{
	name: string,
	slug: string,
	size: string,
} => {
	return getFontSizes().find((item) => item[field] === value);
};
