// @flow
/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';

export const getSpacings = (): Array<{
	slug: string,
	name: string,
	value: string,
}> => {
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

export const getSpacing = (
	slug: string
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return getSpacings().find((item) => item.name === slug);
};

export const getSpacingBy = (
	field: string,
	value: any
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return getSpacings().find((item) => item[field] === value);
};
