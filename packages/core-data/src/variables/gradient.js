// @flow
/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './selectors';

export const getGradients = (): Array<{
	slug: string,
	name: string,
	gradient: string,
}> => {
	return getBlockEditorSettings().gradients;
};

export const getGradient = (
	slug: string
): ?{
	slug: string,
	name: string,
	gradient: string,
} => {
	return getGradients().find((item) => item.name === slug);
};

export const getGradientBy = (
	field: string,
	value: any
): ?{
	slug: string,
	name: string,
	gradient: string,
} => {
	return getGradients().find((item) => item[field] === value);
};
