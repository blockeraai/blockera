// @flow
/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

export const getGradients = (): Array<{
	slug: string,
	name: string,
	value: string,
}> => {
	return getBlockEditorSettings().gradients.map((item) => {
		return {
			name: item.name,
			slug: item.slug,
			value: item.gradient,
		};
	});
};

export const getGradient = (
	slug: string
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return getGradients().find((item) => item.name === slug);
};

export const getGradientBy = (
	field: string,
	value: any
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return getGradients().find((item) => item[field] === value);
};
