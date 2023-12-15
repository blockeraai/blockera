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

const _getLinearGradients = function () {
	return getBlockEditorSettings()
		.gradients.filter((item) => item.gradient.startsWith('linear-gradient'))
		.map((item) => {
			return {
				name: item.name,
				slug: item.slug,
				value: item.gradient,
			};
		});
};

const _getLinearGradientsMemoized = memoize(_getLinearGradients);

export const getLinearGradients = (): Array<VariableItem> => {
	return _getLinearGradientsMemoized();
};

const _getLinearGradient = function (slug: string): ?VariableItem {
	return getLinearGradients().find((item) => item.slug === slug);
};

const _getLinearGradientMemoized = memoize(_getLinearGradient);

export const getLinearGradient = (slug: string): ?VariableItem => {
	return _getLinearGradientMemoized(slug);
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
