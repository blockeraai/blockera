// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

const _getRadialGradients = function () {
	return getBlockEditorSettings()
		.gradients.filter((item) => item.gradient.startsWith('radial-gradient'))
		.map((item) => {
			return {
				name: item.name,
				slug: item.slug,
				value: item.gradient,
			};
		});
};

// eslint-disable-next-line no-unused-vars
const _getRadialGradientsMemoized = memoize(_getRadialGradients);

export const getRadialGradients = (): Array<{
	slug: string,
	name: string,
	value: string,
}> => {
	return _getRadialGradientsMemoized();
};

const _getRadialGradient = function (slug: string): ?{
	slug: string,
	name: string,
	value: string,
} {
	return getRadialGradients().find((item) => item.slug === slug);
};

const _getRadialGradientMemoized = memoize(_getRadialGradient);

export const getRadialGradient = (
	slug: string
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return _getRadialGradientMemoized(slug);
};

const _getRadialGradientBy = function (
	field: string,
	value: any
): ?{
	slug: string,
	name: string,
	value: string,
} {
	return getRadialGradients().find((item) => item[field] === value);
};

const _getRadialGradientByMemoized = memoize(_getRadialGradientBy);

export const getRadialGradientBy = (
	field: string,
	value: any
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return _getRadialGradientByMemoized(field, value);
};
