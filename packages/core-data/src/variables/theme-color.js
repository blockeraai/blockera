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
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';

const _getThemeColors = function (): Array<VariableItem> {
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

export const getThemeColors = (): Array<VariableItem> => {
	return _getThemeColorsMemoized();
};

const _getThemeColor = function (slug: string): ?VariableItem {
	return getThemeColors().find((item) => item.slug === slug);
};

const _getThemeColorMemoized = memoize(_getThemeColor);

export const getThemeColor = (slug: string): ?VariableItem => {
	return _getThemeColorMemoized(slug);
};

const _getThemeColorBy = function (field: string, value: any): ?VariableItem {
	return getThemeColors().find((item) => item[field] === value);
};

const _getThemeColorByMemoized = memoize(_getThemeColorBy);

export const getThemeColorBy = (field: string, value: any): ?VariableItem => {
	return _getThemeColorByMemoized(field, value);
};
