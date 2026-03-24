/**
 * External dependencies
 */
import type { FontSize as FontSizeType } from '@wordpress/global-styles-engine';

function fontSizePresetFingerprint(f: FontSizeType) {
	return {
		slug: f.slug,
		name: f.name,
		size: f.size,
		fluid: f.fluid,
	};
}

export function areFontSizePresetListsEqual(
	a: FontSizeType[],
	b: FontSizeType[]
): boolean {
	return (
		JSON.stringify(a.map(fontSizePresetFingerprint)) ===
		JSON.stringify(b.map(fontSizePresetFingerprint))
	);
}
