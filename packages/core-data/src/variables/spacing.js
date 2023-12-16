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

/**
 * Publisher dependencies
 */
import { isBlockTheme, isUndefined } from '@publisher/utils';
import { getCurrentTheme } from '../index';

const _getSpacings = function (): Array<VariableItem> {
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

		return getBlockEditorSettings()?.__experimentalFeatures?.spacing?.spacingSizes?.theme.map(
			(item) => {
				return {
					name: item.name,
					slug: item.slug,
					value: item.size,
					reference,
				};
			}
		);
	}

	const spaces =
		getBlockEditorSettings()?.__experimentalFeatures?.spacing?.spacingSizes
			?.default;

	if (isUndefined(spaces)) {
		return [];
	}

	return spaces.map((item) => {
		return {
			name: item.name,
			slug: item.slug,
			value: item.size,
		};
	});
};

// eslint-disable-next-line no-unused-vars
const _getSpacingsMemoized = memoize(_getSpacings);

export const getSpacings = (): Array<VariableItem> => {
	return _getSpacingsMemoized();
};

const _getSpacing = function (slug: string): ?VariableItem {
	return getSpacings().find((item) => item.slug === slug);
};

const _getSpacingMemoized = memoize(_getSpacing);

export const getSpacing = (slug: string): ?VariableItem => {
	return _getSpacingMemoized(slug);
};

const _getSpacingBy = function (field: string, value: any): ?VariableItem {
	return getSpacings().find((item) => item[field] === value);
};

const _getSpacingByMemoized = memoize(_getSpacingBy);

export const getSpacingBy = (field: string, value: any): ?VariableItem => {
	return _getSpacingByMemoized(field, value);
};
