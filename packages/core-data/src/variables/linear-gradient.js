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

const _getLinearGradients = function () {
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
				item.gradient.startsWith('linear-gradient')
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
			item.gradient.startsWith('linear-gradient')
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

const _getLinearGradientsMemoized = memoize(_getLinearGradients);

export const getLinearGradients = (): Array<VariableItem> => {
	return _getLinearGradientsMemoized();
};

const _getLinearGradient = function (id: string): ?VariableItem {
	return getLinearGradients().find((item) => item.id === id);
};

const _getLinearGradientMemoized = memoize(_getLinearGradient);

export const getLinearGradient = (id: string): ?VariableItem => {
	return _getLinearGradientMemoized(id);
};

const _getLinearGradientBy = function (
	field: string,
	value: any
): ?VariableItem {
	return getLinearGradients().find((item) => item[field] === value);
};

const _getLinearGradientByMemoized = memoize(_getLinearGradientBy);

export const getLinearGradientBy = (
	field: string,
	value: any
): ?VariableItem => {
	return _getLinearGradientByMemoized(field, value);
};
