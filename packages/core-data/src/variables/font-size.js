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
import { getCurrentTheme } from '../index';

const _getFontSizes = function (): Array<VariableItem> {
	let reference = {
		type: 'preset',
	};

	if (isBlockTheme()) {
		const {
			name: { rendered: themeName },
		} = getCurrentTheme();

		reference = {
			type: 'theme',
			theme: themeName,
		};
	}

	return getBlockEditorSettings().fontSizes.map((item) => {
		return {
			name: item.name,
			id: item.slug,
			value: item.size,
			fluid: item?.fluid || null,
			reference,
		};
	});
};

const _getFontSizesMemoized = memoize(_getFontSizes);

export const getFontSizes = (): Array<VariableItem> => {
	return _getFontSizesMemoized();
};

const _getFontSize = function (id: string): ?VariableItem {
	return getFontSizes().find((item) => item.id === id);
};

const _getFontSizeMemoized = memoize(_getFontSize);

export const getFontSize = (id: string): ?VariableItem => {
	return _getFontSizeMemoized(id);
};

const _getFontSizeBy = function (field: string, value: any): ?VariableItem {
	return getFontSizes().find((item) => item[field] === value);
};

const _getFontSizeByMemoized = memoize(_getFontSizeBy);

export const getFontSizeBy = (field: string, value: any): ?VariableItem => {
	return _getFontSizeByMemoized(field, value);
};
