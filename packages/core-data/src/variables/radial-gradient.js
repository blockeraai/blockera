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

const _getRadialGradients = function () {
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

		return getBlockEditorSettings()
			?.__experimentalFeatures?.color?.gradients?.theme.filter((item) =>
				item.gradient.startsWith('radial-gradient')
			)
			.map((item) => {
				return {
					name: item.name,
					id: item.slug,
					value: item.gradient,
					reference,
				};
			});
	}

	if (
		isUndefined(
			getBlockEditorSettings()?.__experimentalFeatures?.color?.gradients
				?.default
		)
	) {
		return [];
	}

	return getBlockEditorSettings()
		?.__experimentalFeatures?.color?.gradients?.default.filter((item) =>
			item.gradient.startsWith('radial-gradient')
		)
		.map((item) => {
			return {
				name: item.name,
				id: item.slug,
				value: item.gradient,
				reference,
			};
		});
};

// eslint-disable-next-line no-unused-vars
const _getRadialGradientsMemoized = memoize(_getRadialGradients);

export const getRadialGradients = (): Array<VariableItem> => {
	return _getRadialGradientsMemoized();
};

const _getRadialGradient = function (id: string): ?VariableItem {
	return getRadialGradients().find((item) => item.id === id);
};

const _getRadialGradientMemoized = memoize(_getRadialGradient);

export const getRadialGradient = (id: string): ?VariableItem => {
	return _getRadialGradientMemoized(id);
};

const _getRadialGradientBy = function (
	field: string,
	value: any
): ?VariableItem {
	return getRadialGradients().find((item) => item[field] === value);
};

const _getRadialGradientByMemoized = memoize(_getRadialGradientBy);

export const getRadialGradientBy = (
	field: string,
	value: any
): ?VariableItem => {
	return _getRadialGradientByMemoized(field, value);
};
