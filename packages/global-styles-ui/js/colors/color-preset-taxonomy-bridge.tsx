/**
 * External dependencies
 */
import type { ElementType, ReactNode } from 'react';
import { useCallback, useMemo } from '@wordpress/element';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { cleanupRepeater } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { PresetFieldsPropsResolver } from '../components/preset-group';
import type { TaxonomyGroupBranch } from '../components/preset-taxonomy/types';
import { PresetTaxonomySection } from '../components/shared-preset-taxonomy';
import {
	convertRepeaterValueToColors,
	mergeColorPaletteWithKeptShades,
} from './utils';
import { ColorPresetTaxonomyBody } from './color-preset-taxonomy-body';

export type ColorPresetTaxonomyBridgeProps = {
	controlName: string;
	mainColors: Array<Color & Record<string, unknown>>;
	colorsForShadeMerge: Color[];
	tree: TaxonomyGroupBranch<Color & Record<string, unknown>>[];
	origin: string;
	defaultRepeaterItemShape: Record<string, unknown>;
	PresetFields: ElementType;
	repeaterItemHeader: ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	onPersistPalette: (colors: Color[]) => void;
	renderTaxonomyCategoryClosedPreview?: (
		presets: Array<Color & Record<string, unknown>>
	) => ReactNode;
};

/** Color preset taxonomy entry: bridge persistence plus taxonomy tree body. */
export function ColorPresetTaxonomyBridge({
	controlName,
	mainColors,
	colorsForShadeMerge,
	tree,
	origin,
	defaultRepeaterItemShape,
	PresetFields,
	repeaterItemHeader,
	presetFieldsPropsResolver,
	onPersistPalette,
	renderTaxonomyCategoryClosedPreview,
}: ColorPresetTaxonomyBridgeProps) {
	const bridgeControlId = `${controlName}-taxonomy-tree`;

	const cleanRepeaterForPersist = useCallback((raw: unknown) => {
		const cleaned = cleanupRepeater(raw as Record<string, unknown>);
		delete cleaned?.renderRepeaterItem;
		return cleaned as Record<string, unknown>;
	}, []);

	const handleRepeaterRootChange = useCallback(
		(newValue: unknown) => {
			let payload = newValue;
			if (
				payload !== null &&
				typeof payload === 'object' &&
				Object.prototype.hasOwnProperty.call(
					payload,
					'modifyControlValue'
				) &&
				(payload as { value?: unknown }).value !== undefined &&
				(payload as { value?: unknown }).value !== null
			) {
				payload = cleanRepeaterForPersist(
					(payload as { value: unknown }).value as Record<
						string,
						unknown
					>
				);
			}
			const nextTaxonomy = convertRepeaterValueToColors(
				payload as object,
				colorsForShadeMerge
			);
			const bySlug = new Map(
				nextTaxonomy.map((r) => [String(r.slug ?? ''), r])
			);
			const mergedFull = colorsForShadeMerge.map((row) => {
				const slug = String(row.slug ?? '');
				const rep = bySlug.get(slug);
				return (rep ?? row) as Color;
			});
			const merged = mergeColorPaletteWithKeptShades(
				colorsForShadeMerge,
				mergedFull
			);
			onPersistPalette(merged);
		},
		[cleanRepeaterForPersist, colorsForShadeMerge, onPersistPalette]
	);

	const repeaterContextValue = useMemo(
		() => ({
			name: bridgeControlId,
			value: mainColors,
		}),
		[bridgeControlId, mainColors]
	);

	return (
		<PresetTaxonomySection
			bridgeControlId={bridgeControlId}
			repeaterContextValue={repeaterContextValue}
			defaultRepeaterItemShape={defaultRepeaterItemShape}
			cleanRepeaterForPersist={cleanRepeaterForPersist}
			handleRepeaterRootChange={handleRepeaterRootChange}
		>
			<ColorPresetTaxonomyBody
				tree={tree}
				origin={origin}
				PresetFields={PresetFields}
				repeaterItemHeader={repeaterItemHeader}
				presetFieldsPropsResolver={presetFieldsPropsResolver}
				renderTaxonomyCategoryClosedPreview={
					renderTaxonomyCategoryClosedPreview
				}
			/>
		</PresetTaxonomySection>
	);
}
