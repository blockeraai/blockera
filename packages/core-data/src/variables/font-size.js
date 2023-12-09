// @flow
/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

export const getFontSizes = (): Array<{
	name: string,
	slug: string,
	value: string,
	fluid: string | Object,
}> => {
	return getBlockEditorSettings().fontSizes.map((item) => {
		return {
			name: item.name,
			slug: item.slug,
			value: item.size,
			fluid: item?.fluid || '',
		};
	});
};

export const getFontSize = (
	slug: string
): ?{
	name: string,
	slug: string,
	value: string,
	fluid: string | Object,
} => {
	return getFontSizes().find((item) => item.slug === slug);
};

export const getFontSizeBy = (
	field: string,
	value: any
): ?{
	name: string,
	slug: string,
	value: string,
	fluid: string | Object,
} => {
	return getFontSizes().find((item) => item[field] === value);
};
