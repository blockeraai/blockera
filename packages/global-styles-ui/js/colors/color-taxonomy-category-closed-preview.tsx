/**
 * External dependencies
 */
import type { Color } from '@wordpress/global-styles-engine';
import { memo, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { ColorIndicatorStack } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { useColorPaletteVariationsStorage } from './color-palette-variations-context';
import { filterVariationsByBase } from './color-palette-variations-utils';
import { ColorPresetShadeStackHeader } from './color-shades-repeater-item';
import { isShadePaletteColor } from './utils';

function presetToIndicatorStackEntry(
	preset: Color & Record<string, unknown>
): string | { value: string; type: string } | null {
	const value = String(preset.color ?? '');
	const typeStr = String(preset.type ?? '');
	const isGradient =
		typeStr === 'linear-gradient' ||
		typeStr === 'radial-gradient' ||
		(typeof preset.color === 'string' &&
			preset.color.includes('gradient('));

	if (!value && !isGradient) {
		return null;
	}

	if (isGradient) {
		return {
			value,
			type: typeStr !== '' ? typeStr : 'linear-gradient',
		};
	}

	return { value, type: 'color' };
}

export type ColorTaxonomyCategoryClosedPreviewProps = {
	presets: Array<Color & Record<string, unknown>>;
};

/**
 * Collapsed taxonomy accordion header preview for palette categories (`show-preview`).
 * Merges base-variable swatches via {@link ColorIndicatorStack}. When any listed variable has
 * shade variations, shows only the **first** variable’s shade ramp (ordered base presets).
 */
export const ColorTaxonomyCategoryClosedPreview = memo(
	function ColorTaxonomyCategoryClosedPreview({
		presets,
	}: ColorTaxonomyCategoryClosedPreviewProps) {
		const { fullPalette } = useColorPaletteVariationsStorage();

		const basePresets = useMemo(
			() =>
				presets.filter(
					(p) =>
						!isShadePaletteColor(
							p as Color & Record<string, unknown>
						)
				),
			[presets]
		);

		const sectionHasVariations = useMemo(
			() =>
				basePresets.some((p) => {
					const slug = String(p.slug ?? '');
					return (
						slug !== '' &&
						filterVariationsByBase(fullPalette, slug).length > 0
					);
				}),
			[basePresets, fullPalette]
		);

		const mergedStackEntries = useMemo(() => {
			const out: Array<string | { value: string; type: string }> = [];
			for (const p of basePresets) {
				const entry = presetToIndicatorStackEntry(p);
				if (entry) {
					out.push(entry);
				}
			}
			return out;
		}, [basePresets]);

		const firstBase = basePresets[0];

		if (sectionHasVariations && firstBase) {
			const slug = String(firstBase.slug ?? '');
			return (
				<ColorPresetShadeStackHeader
					baseSlug={slug}
					mainPreset={{
						slug,
						name: String(firstBase.name ?? ''),
						color: firstBase.color,
					}}
				/>
			);
		}

		if (!mergedStackEntries.length) {
			return null;
		}

		return (
			<ColorIndicatorStack
				value={mergedStackEntries}
				size={16}
				maxItems={8}
			/>
		);
	}
);
