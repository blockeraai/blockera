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
import {
	compositeResolvedValueFromStoredPlainPresetInput,
	splitStoredCompositePlainPresetValue,
} from '../theme-json-plain-preset';
import { usePresetVariationsStorage } from '../context/preset-variations-context';
import { filterVariationsByBase } from './color-palette-variations-utils';
import { ColorPresetShadeStackHeader } from './color-shades-repeater-item';
import { isShadePaletteColor } from './utils';

function presetToIndicatorStackEntry(
	preset: Color & Record<string, unknown>
): string | { value: string; type: string } | null {
	const raw = preset.color;
	let paintRaw: string;
	if (typeof raw === 'string') {
		paintRaw = splitStoredCompositePlainPresetValue(raw)
			? compositeResolvedValueFromStoredPlainPresetInput(raw)
			: raw;
	} else {
		paintRaw = String(raw ?? '');
	}
	const value = paintRaw;
	const typeStr = String(preset.type ?? '');
	const isGradient =
		typeStr === 'linear-gradient' ||
		typeStr === 'radial-gradient' ||
		(typeof paintRaw === 'string' && paintRaw.includes('gradient('));

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

/** True when any non-shade preset in the slice has persisted shade rows on the full palette. */
export function taxonomyCategoryHasBaseWithShadeVariations(
	presets: Array<Color & Record<string, unknown>>,
	fullItems: Color[]
): boolean {
	for (const p of presets) {
		if (isShadePaletteColor(p as Color & Record<string, unknown>)) {
			continue;
		}
		const slug = String(p.slug ?? '');
		if (slug !== '' && filterVariationsByBase(fullItems, slug).length > 0) {
			return true;
		}
	}
	return false;
}

/**
 * Collapsed taxonomy accordion header preview for palette categories (`show-preview`).
 * Merges base-variable swatches via {@link ColorIndicatorStack}. When any listed base preset has
 * shade variations, shows that preset’s ramp — the **first** base (in category order) that
 * reports variations, not merely the first row in the list.
 */
export const ColorTaxonomyCategoryClosedPreview = memo(
	function ColorTaxonomyCategoryClosedPreview({
		presets,
	}: ColorTaxonomyCategoryClosedPreviewProps) {
		const { fullItems } = usePresetVariationsStorage<Color>();

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

		const firstBaseWithVariations = useMemo(() => {
			for (const p of basePresets) {
				const slug = String(p.slug ?? '');
				if (
					slug !== '' &&
					filterVariationsByBase(fullItems, slug).length > 0
				) {
					return p;
				}
			}
			return null;
		}, [basePresets, fullItems]);

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

		if (firstBaseWithVariations) {
			const slug = String(firstBaseWithVariations.slug ?? '');
			return (
				<ColorPresetShadeStackHeader
					baseSlug={slug}
					mainPreset={{
						slug,
						name: String(firstBaseWithVariations.name ?? ''),
						color: firstBaseWithVariations.color,
						type:
							typeof firstBaseWithVariations.type === 'string'
								? firstBaseWithVariations.type
								: undefined,
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
