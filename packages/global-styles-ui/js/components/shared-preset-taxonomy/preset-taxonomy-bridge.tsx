/**
 * External dependencies
 */
import type { ElementType, ReactNode } from 'react';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { cleanupRepeater } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { PresetFieldsPropsResolver } from '../preset-group';
import type { TaxonomyGroupBranch } from '../preset-taxonomy/types';
import { PresetTaxonomySection } from './preset-taxonomy-section';
import { PresetTaxonomyBody } from './preset-taxonomy-body';

export type PresetTaxonomyBridgeProps<TItem extends Record<string, unknown>> = {
	controlName: string;
	mainRepeaterValue: TItem[];
	/** Baseline rows merged with repeater output (e.g. theme shades kept outside taxonomy slice). */
	baselineItems: TItem[];
	mergeRepeaterPayloadIntoPersisted: (
		payload: object,
		baselineItems: TItem[]
	) => TItem[];
	onPersistItems: (items: TItem[]) => void;
	tree: TaxonomyGroupBranch<TItem>[];
	origin: string;
	defaultRepeaterItemShape: Record<string, unknown>;
	PresetFields: ElementType;
	repeaterItemHeader: ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	renderTaxonomyCategoryClosedPreview?: (presets: TItem[]) => ReactNode;
	augmentCategoryShowPreview?: (
		presets: TItem[],
		fullItems: TItem[]
	) => boolean;
};

export function PresetTaxonomyBridge<TItem extends Record<string, unknown>>({
	controlName,
	mainRepeaterValue,
	baselineItems,
	mergeRepeaterPayloadIntoPersisted,
	onPersistItems,
	tree,
	origin,
	defaultRepeaterItemShape,
	PresetFields,
	repeaterItemHeader,
	presetFieldsPropsResolver,
	renderTaxonomyCategoryClosedPreview,
	augmentCategoryShowPreview,
}: PresetTaxonomyBridgeProps<TItem>) {
	const bridgeControlId = `${controlName}-taxonomy-tree`;

	const cleanRepeaterForPersist = useCallback((raw: unknown) => {
		const cleaned = cleanupRepeater(raw as Record<string, unknown>);
		delete cleaned?.renderRepeaterItem;
		return cleaned as Record<string, unknown>;
	}, []);

	const handleRepeaterRootChange = useCallback(
		(newValue: unknown) => {
			let payload: unknown = newValue;
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
			const merged = mergeRepeaterPayloadIntoPersisted(
				payload as object,
				baselineItems
			);
			onPersistItems(merged);
		},
		[
			baselineItems,
			cleanRepeaterForPersist,
			mergeRepeaterPayloadIntoPersisted,
			onPersistItems,
		]
	);

	const repeaterContextValue = useMemo(
		() => ({
			name: bridgeControlId,
			value: mainRepeaterValue,
		}),
		[bridgeControlId, mainRepeaterValue]
	);

	return (
		<PresetTaxonomySection
			bridgeControlId={bridgeControlId}
			repeaterContextValue={repeaterContextValue}
			defaultRepeaterItemShape={defaultRepeaterItemShape}
			cleanRepeaterForPersist={cleanRepeaterForPersist}
			handleRepeaterRootChange={handleRepeaterRootChange}
		>
			<PresetTaxonomyBody<TItem>
				tree={tree}
				origin={origin}
				PresetFields={PresetFields}
				repeaterItemHeader={repeaterItemHeader}
				presetFieldsPropsResolver={presetFieldsPropsResolver}
				renderTaxonomyCategoryClosedPreview={
					renderTaxonomyCategoryClosedPreview
				}
				augmentCategoryShowPreview={augmentCategoryShowPreview}
			/>
		</PresetTaxonomySection>
	);
}
