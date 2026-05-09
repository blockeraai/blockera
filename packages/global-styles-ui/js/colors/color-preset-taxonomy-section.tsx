/**
 * External dependencies
 */
import type { ElementType, ReactNode } from 'react';
import { useCallback, useMemo } from '@wordpress/element';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	cleanupRepeater,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { PresetStateContainer } from '../components/preset-state-container';
import type { PresetFieldsPropsResolver } from '../components/preset-group';
import type { TaxonomyGroupBranch } from '../components/preset-taxonomy/types';
import { TaxonomyRepeaterBridgeInner } from '../components/preset-taxonomy-ui';
import '../components/preset-taxonomy-ui/style.scss';
import {
	convertRepeaterValueToColors,
	mergeColorPaletteWithKeptShades,
} from './utils';
import { ColorPresetTaxonomyTreeBody } from './color-preset-taxonomy-tree-body';

export type ColorPresetTaxonomySectionProps = {
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
	/**
	 * Closed-state accordion header preview (inline-end). Omit to suppress aggregated previews.
	 * Consumers supply preset-feature UI (e.g. color palette stack preview component).
	 */
	renderTaxonomyCategoryClosedPreview?: (
		presets: Array<Color & Record<string, unknown>>
	) => ReactNode;
};

export function ColorPresetTaxonomySection({
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
}: ColorPresetTaxonomySectionProps) {
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
		<PresetStateContainer activeColor="#1ca120">
			<div className="blockera-preset-taxonomy-tree">
				<ControlContextProvider
					value={repeaterContextValue}
					storeName={'blockera/controls/repeater'}
				>
					<BaseControl
						controlName={bridgeControlId}
						columns="columns-1"
					>
						<TaxonomyRepeaterBridgeInner
							controlId={bridgeControlId}
							defaultRepeaterItemValue={defaultRepeaterItemShape}
							valueCleanup={cleanRepeaterForPersist}
							handleRepeaterRootChange={handleRepeaterRootChange}
						>
							<ColorPresetTaxonomyTreeBody
								tree={tree}
								origin={origin}
								PresetFields={PresetFields}
								repeaterItemHeader={repeaterItemHeader}
								presetFieldsPropsResolver={
									presetFieldsPropsResolver
								}
								renderTaxonomyCategoryClosedPreview={
									renderTaxonomyCategoryClosedPreview
								}
							/>
						</TaxonomyRepeaterBridgeInner>
					</BaseControl>
				</ControlContextProvider>
			</div>
		</PresetStateContainer>
	);
}
