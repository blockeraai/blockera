// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';

const _getFontSizes = function () {
	return getBlockEditorSettings().fontSizes.map((item) => {
		return {
			name: item.name,
			slug: item.slug,
			value: item.size,
			fluid: item?.fluid || null,
		};
	});
};

const _getFontSizesMemoized = memoize(_getFontSizes);

export const getFontSizes = (): Array<VariableItem> => {
	return _getFontSizesMemoized();
};

const _getFontSize = function (slug: string): ?VariableItem {
	return getFontSizes().find((item) => item.slug === slug);
};

const _getFontSizeMemoized = memoize(_getFontSize);

export const getFontSize = (slug: string): ?VariableItem => {
	return _getFontSizeMemoized(slug);
};

const _getFontSizeBy = function (field: string, value: any): ?VariableItem {
	return getFontSizes().find((item) => item[field] === value);
};

const _getFontSizeByMemoized = memoize(_getFontSizeBy);

export const getFontSizeBy = (field: string, value: any): ?VariableItem => {
	return _getFontSizeByMemoized(field, value);
};
