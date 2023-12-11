// @flow
/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

export const getLinearGradients = (): Array<{
	slug: string,
	name: string,
	value: string,
}> => {
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

export const getLinearGradient = (
	slug: string
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return getLinearGradients().find((item) => item.name === slug);
};

export const getLinearGradientBy = (
	field: string,
	value: any
): ?{
	slug: string,
	name: string,
	value: string,
} => {
	return getLinearGradients().find((item) => item[field] === value);
};
