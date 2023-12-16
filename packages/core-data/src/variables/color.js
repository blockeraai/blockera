// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Publisher dependencies
 */
import { isBlockTheme, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';
import { getCurrentTheme } from '../index';

const _getColors = function (): Array<VariableItem> {
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

		return getBlockEditorSettings()?.__experimentalFeatures?.color?.palette?.theme.map(
			(item) => {
				return {
					name: item.name,
					slug: item.slug,
					value: item.color,
					reference,
				};
			}
		);
	}

	if (
		isUndefined(
			getBlockEditorSettings()?.__experimentalFeatures?.color?.palette
				?.default
		)
	) {
		return [];
	}

	return getBlockEditorSettings()?.__experimentalFeatures?.color?.palette?.default.map(
		(item) => {
			return {
				name: item.name,
				slug: item.slug,
				value: item.color,
				reference,
			};
		}
	);
};

// eslint-disable-next-line no-unused-vars
const _getColorsMemoized = memoize(_getColors);

export const getColors = (): Array<VariableItem> => {
	return _getColorsMemoized();
};

const _getColor = function (slug: string): ?VariableItem {
	return getColors().find((item) => item.slug === slug);
};

const _getColorMemoized = memoize(_getColor);

export const getColor = (slug: string): ?VariableItem => {
	return _getColorMemoized(slug);
};

const _getColorBy = function (field: string, value: any): ?VariableItem {
	return getColors().find((item) => item[field] === value);
};

const _getColorByMemoized = memoize(_getColorBy);

export const getColorBy = (field: string, value: any): ?VariableItem => {
	return _getColorByMemoized(field, value);
};
