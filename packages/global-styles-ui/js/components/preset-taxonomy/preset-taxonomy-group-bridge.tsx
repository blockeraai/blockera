/**
 * External dependencies
 */
import type { ComponentType, ElementType, ReactNode } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { PresetFieldsPropsResolver } from '../preset-group';
import type { VariableType } from '../types';
import type { TaxonomyGroupBranch } from './types';
import type { UsePresetTaxonomyGroupUiResult } from './use-preset-taxonomy-group-ui';

export type PresetTaxonomyGroupBridgeProps<
	TItem extends Record<string, unknown>,
> = {
	taxonomy: UsePresetTaxonomyGroupUiResult<TItem>;
	controlName: string;
	origin: string;
	baselineItems: TItem[];
	PresetFields: ElementType;
	repeaterItemHeader: ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	renderTaxonomyCategoryClosedPreview?: (presets: TItem[]) => ReactNode;
	augmentCategoryShowPreview?: (
		presets: TItem[],
		fullItems: TItem[]
	) => boolean;
	repeaterItemVariations?: ComponentType<{
		item: VariableType | Record<string, unknown>;
		itemId: string;
	}> | null;
	PresetTaxonomyBridge: ComponentType<{
		controlName: string;
		mainRepeaterValue: TItem[];
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
		repeaterItemVariations?: ComponentType<{
			item: VariableType | Record<string, unknown>;
			itemId: string;
		}> | null;
	}>;
};

/** Renders taxonomy bridge when enabled; null otherwise. */
export function PresetTaxonomyGroupBridge<
	TItem extends Record<string, unknown>,
>({
	taxonomy,
	controlName,
	origin,
	baselineItems,
	PresetFields,
	repeaterItemHeader,
	presetFieldsPropsResolver,
	renderTaxonomyCategoryClosedPreview,
	augmentCategoryShowPreview,
	repeaterItemVariations,
	PresetTaxonomyBridge,
}: PresetTaxonomyGroupBridgeProps<TItem>) {
	if (!taxonomy.showTaxonomyUi || taxonomy.taxonomyTree.length < 1) {
		return null;
	}

	return (
		<PresetTaxonomyBridge
			controlName={controlName}
			mainRepeaterValue={taxonomy.taxonomyBridgeMainItems}
			baselineItems={baselineItems}
			mergeRepeaterPayloadIntoPersisted={
				taxonomy.mergeTaxonomyRepeaterIntoPersisted
			}
			onPersistItems={taxonomy.setFullItems}
			tree={taxonomy.taxonomyTree}
			origin={origin}
			defaultRepeaterItemShape={taxonomy.taxonomyRepeaterDefaults}
			PresetFields={PresetFields}
			repeaterItemHeader={repeaterItemHeader}
			presetFieldsPropsResolver={presetFieldsPropsResolver}
			renderTaxonomyCategoryClosedPreview={
				renderTaxonomyCategoryClosedPreview
			}
			augmentCategoryShowPreview={augmentCategoryShowPreview}
			repeaterItemVariations={repeaterItemVariations}
		/>
	);
}
