// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Publisher dependencies
 */
import { isBlockTheme } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

const _getThemeColors = function () {
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

// eslint-disable-next-line no-unused-vars
const _getThemeColorsMemoized = memoize(_getThemeColors);

export const getThemeColors = (): Array<{
	name: string,
	slug: string,
	value: string,
}> => {
	return _getThemeColorsMemoized();
};

const _getThemeColor = function (slug: string): ?{
	name: string,
	slug: string,
	value: string,
} {
	return getThemeColors().find((item) => item.slug === slug);
};

const _getThemeColorMemoized = memoize(_getThemeColor);

export const getThemeColor = (
	slug: string
): ?{
	name: string,
	slug: string,
	value: string,
} => {
	return _getThemeColorMemoized(slug);
};

const _getThemeColorBy = function (
	field: string,
	value: any
): ?{
	name: string,
	slug: string,
	value: string,
} {
	return getThemeColors().find((item) => item[field] === value);
};

const _getThemeColorByMemoized = memoize(_getThemeColorBy);

export const getThemeColorBy = (
	field: string,
	value: any
): ?{
	name: string,
	slug: string,
	value: string,
} => {
	return _getThemeColorByMemoized(field, value);
};
