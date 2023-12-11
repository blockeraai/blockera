// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';

const _getSpacings = function () {
	// todo improve this to support all states and be more safe
	const spaces =
		getBlockEditorSettings()?.__experimentalFeatures?.spacing?.spacingSizes
			?.theme;

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

export const getSpacings = (): Array<{
	slug: string,
	name: string,
	value: string,
}> => {
	return _getSpacingsMemoized();
};

const _getSpacing = function (slug: string): ?{
	slug: string,
	name: string,
	value: string,
} {
	return getSpacings().find((item) => item.slug === slug);
};

const _getSpacingMemoized = memoize(_getSpacing);

export const getSpacing = (
	slug: string
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return _getSpacingMemoized(slug);
};

const _getSpacingBy = function (
	field: string,
	value: any
): ?{
	slug: string,
	name: string,
	value: string,
} {
	return getSpacings().find((item) => item[field] === value);
};

const _getSpacingByMemoized = memoize(_getSpacingBy);

export const getSpacingBy = (
	field: string,
	value: any
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return _getSpacingByMemoized(field, value);
};
