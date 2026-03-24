/**
 * External dependencies
 */
import type { Color, Gradient } from '@wordpress/global-styles-engine';

export function convertRepeaterValueToGradients(newValue: object): Gradient[] {
	return Object.values(
		newValue as Record<string, Gradient & Record<string, unknown>>
	).map((v) => ({
		slug: v.slug,
		name: v.name,
		gradient: v.gradient || '',
	}));
}

export function convertRepeaterValueToColors(newValue: object): Color[] {
	return Object.values(
		newValue as Record<string, Color & Record<string, unknown>>
	).map((v) => ({
		slug: v.slug,
		name: v.name,
		color: v.color || '',
	}));
}

export function filterLinearGradients(
	gradients: Gradient[] | undefined
): Gradient[] {
	if (!gradients || !Array.isArray(gradients)) {
		return [];
	}
	return gradients.filter((g) =>
		(g?.gradient || '').startsWith('linear-gradient')
	);
}

export function filterRadialGradients(
	gradients: Gradient[] | undefined
): Gradient[] {
	if (!gradients || !Array.isArray(gradients)) {
		return [];
	}
	return gradients.filter((g) =>
		(g?.gradient || '').startsWith('radial-gradient')
	);
}
