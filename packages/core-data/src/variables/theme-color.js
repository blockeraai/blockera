// @flow
/**
 * Publisher dependencies
 */
import { isBlockTheme } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

export const getThemeColors = (): Array<{
	name: string,
	slug: string,
	value: string,
}> => {
	if (!isBlockTheme()) {
		return [];
	}

	return getBlockEditorSettings()?.colors.map((item) => {
		return {
			name: item.name,
			slug: item.slug,
			value: item.color,
		};
	});
};

export const getThemeColor = (
	slug: string
): ?{
	name: string,
	slug: string,
	value: string,
} => {
	return getThemeColors().find((item) => item.slug === slug);
};

export const getThemeColorBy = (
	field: string,
	value: any
): ?{
	name: string,
	slug: string,
	value: string,
} => {
	return getThemeColors().find((item) => item[field] === value);
};
