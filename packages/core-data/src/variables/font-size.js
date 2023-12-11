// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

const _getFontSizes = function () {
	return getBlockEditorSettings().fontSizes.map((item) => {
		return {
			name: item.name,
			slug: item.slug,
			value: item.size,
			fluid: item?.fluid || '',
		};
	});
};

const _getFontSizesMemoized = memoize(_getFontSizes);

export const getFontSizes = (): Array<{
	name: string,
	slug: string,
	value: string,
	fluid: string | Object,
}> => {
	return _getFontSizesMemoized();
};

const _getFontSize = function (slug: string): ?{
	name: string,
	slug: string,
	value: string,
	fluid: string | Object,
} {
	return getFontSizes().find((item) => item.slug === slug);
};

const _getFontSizeMemoized = memoize(_getFontSize);

export const getFontSize = (
	slug: string
): ?{
	name: string,
	slug: string,
	value: string,
	fluid: string | Object,
} => {
	return _getFontSizeMemoized(slug);
};

const _getFontSizeBy = function (
	field: string,
	value: any
): ?{
	name: string,
	slug: string,
	value: string,
	fluid: string | Object,
} {
	return getFontSizes().find((item) => item[field] === value);
};

const _getFontSizeByMemoized = memoize(_getFontSizeBy);

export const getFontSizeBy = (
	field: string,
	value: any
): ?{
	name: string,
	slug: string,
	value: string,
	fluid: string | Object,
} => {
	return _getFontSizeByMemoized(field, value);
};
