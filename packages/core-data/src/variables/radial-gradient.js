// @flow
/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

export const getRadialGradients = (): Array<{
	slug: string,
	name: string,
	value: string,
}> => {
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

export const getRadialGradient = (
	slug: string
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return getRadialGradients().find((item) => item.name === slug);
};

export const getRadialGradientBy = (
	field: string,
	value: any
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return getRadialGradients().find((item) => item[field] === value);
};
