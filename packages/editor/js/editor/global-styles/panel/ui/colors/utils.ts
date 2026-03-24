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

function gradientPresetFingerprint(g: Gradient) {
	return { slug: g.slug, name: g.name, gradient: g.gradient };
}

export function areGradientPresetListsEqual(
	a: Gradient[],
	b: Gradient[]
): boolean {
	return (
		JSON.stringify(a.map(gradientPresetFingerprint)) ===
		JSON.stringify(b.map(gradientPresetFingerprint))
	);
}

function colorPresetFingerprint(c: Color) {
	return { slug: c.slug, name: c.name, color: c.color };
}

export function areColorPresetListsEqual(a: Color[], b: Color[]): boolean {
	return (
		JSON.stringify(a.map(colorPresetFingerprint)) ===
		JSON.stringify(b.map(colorPresetFingerprint))
	);
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
