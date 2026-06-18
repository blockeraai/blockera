/**
 * External dependencies
 */
import type { ElementType, ReactNode } from 'react';
import { useCallback, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { RepeaterContext } from '@blockera/controls';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { PresetFieldsPropsResolver } from '../preset-group';
import type {
	TaxonomyCategoryBranch,
	TaxonomyCategoryChildRef,
	TaxonomyGroupBranch,
	TaxonomyGroupChildRef,
} from '../preset-taxonomy/types';
import { usePresetVariationsStorage } from '../../context/preset-variations-context';
import { TaxonomyCategoryAccordion } from './taxonomy-category-accordion';
import { TaxonomyGroupHeader } from './taxonomy-group-header';
import { PresetTaxonomyPopoverRow } from './preset-taxonomy-popover-row';
import {
	findRepeaterItemIdBySlug,
	collectTaxonomyCategoryPresets,
} from './preset-taxonomy-utils';

function countPresetsInCategory<T extends Record<string, unknown>>(
	category: TaxonomyCategoryBranch<T>
): number {
	let total = category.directPresets.length;
	for (const sub of category.subSections) {
		total += sub.presets.length;
	}
	return total;
}

/** When exactly one preset spans direct rows and all sub-sections, omit category accordion. */
function getSolePresetInCategory<T extends Record<string, unknown>>(
	category: TaxonomyCategoryBranch<T>
): T | undefined {
	if (countPresetsInCategory(category) !== 1) {
		return undefined;
	}
	if (category.directPresets.length === 1) {
		return category.directPresets[0];
	}
	for (const sub of category.subSections) {
		if (sub.presets.length === 1) {
			return sub.presets[0];
		}
	}
	return undefined;
}

function defaultGroupChildOrder<T extends Record<string, unknown>>(
	group: TaxonomyGroupBranch<T>
): TaxonomyGroupChildRef[] {
	const refs: TaxonomyGroupChildRef[] = [];
	for (const preset of group.directPresets) {
		refs.push({ kind: 'preset', slug: String(preset.slug ?? '') });
	}
	for (const category of group.categories) {
		refs.push({ kind: 'category', slug: category.slug });
	}
	return refs;
}

function defaultCategoryChildOrder<T extends Record<string, unknown>>(
	category: TaxonomyCategoryBranch<T>
): TaxonomyCategoryChildRef[] {
	const refs: TaxonomyCategoryChildRef[] = [];
	for (const preset of category.directPresets) {
		refs.push({ kind: 'preset', slug: String(preset.slug ?? '') });
	}
	for (const sub of category.subSections) {
		refs.push({ kind: 'sub', slug: sub.slug });
	}
	return refs;
}

export type PresetTaxonomyBodyProps<TPreset extends Record<string, unknown>> = {
	tree: TaxonomyGroupBranch<TPreset>[];
	origin: string;
	PresetFields: ElementType;
	repeaterItemHeader: ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	renderTaxonomyCategoryClosedPreview?: (presets: TPreset[]) => ReactNode;
	/**
	 * When true alongside taxonomy `showPreview`, drives accordion preview visibility
	 * (e.g. persisted variation rows not reflected in declarations alone).
	 */
	augmentCategoryShowPreview?: (
		presets: TPreset[],
		fullItems: TPreset[]
	) => boolean;
};

export function PresetTaxonomyBody<TPreset extends Record<string, unknown>>({
	tree,
	origin,
	PresetFields,
	repeaterItemHeader,
	presetFieldsPropsResolver,
	renderTaxonomyCategoryClosedPreview,
	augmentCategoryShowPreview,
}: PresetTaxonomyBodyProps<TPreset>) {
	const { repeaterItems } = useContext(RepeaterContext) as {
		repeaterItems?: Record<string, { slug?: string }>;
	};
	const { fullItems } = usePresetVariationsStorage<TPreset>();

	const resolveItemId = useCallback(
		(slug: string) => findRepeaterItemIdBySlug(repeaterItems, slug) ?? slug,
		[repeaterItems]
	);

	const augmentPreview = augmentCategoryShowPreview ?? (() => false);

	const renderPopoverRow = useCallback(
		(preset: TPreset, rowKey: string) => (
			<PresetTaxonomyPopoverRow
				key={rowKey}
				item={preset}
				itemId={resolveItemId(String(preset.slug ?? ''))}
				origin={origin}
				PresetFields={PresetFields}
				repeaterItemHeader={repeaterItemHeader}
				presetFieldsPropsResolver={presetFieldsPropsResolver}
			/>
		),
		[
			PresetFields,
			origin,
			presetFieldsPropsResolver,
			repeaterItemHeader,
			resolveItemId,
		]
	);

	const renderCategorySubSection = useCallback(
		(
			group: TaxonomyGroupBranch<TPreset>,
			cat: TaxonomyCategoryBranch<TPreset>,
			sub: TaxonomyCategoryBranch<TPreset>['subSections'][number]
		) => {
			if (sub.presets.length === 1) {
				return renderPopoverRow(
					sub.presets[0],
					`${group.slug}-${cat.slug}-${sub.slug}-${String(sub.presets[0].slug ?? '')}`
				);
			}
			const subPresetsForPreview = sub.presets;
			const shouldShowSubClosedPreview =
				Boolean(renderTaxonomyCategoryClosedPreview) &&
				subPresetsForPreview.length > 0;
			return (
				<TaxonomyCategoryAccordion
					key={`${group.slug}-${cat.slug}-${sub.slug}`}
					title={sub.name}
					{...(sub.initialOpen !== undefined
						? { defaultOpen: sub.initialOpen }
						: {})}
					showPreview={
						shouldShowSubClosedPreview ||
						sub.showPreview ||
						augmentPreview(subPresetsForPreview, fullItems)
					}
					renderClosedHeaderPreview={
						renderTaxonomyCategoryClosedPreview
							? () =>
									renderTaxonomyCategoryClosedPreview(
										sub.presets
									)
							: undefined
					}
				>
					{sub.presets.map((preset) =>
						renderPopoverRow(preset, String(preset.slug ?? ''))
					)}
				</TaxonomyCategoryAccordion>
			);
		},
		[
			augmentPreview,
			fullItems,
			renderPopoverRow,
			renderTaxonomyCategoryClosedPreview,
		]
	);

	const renderCategoryChildren = useCallback(
		(
			group: TaxonomyGroupBranch<TPreset>,
			cat: TaxonomyCategoryBranch<TPreset>
		) => {
			const childOrder = cat.childOrder?.length
				? cat.childOrder
				: defaultCategoryChildOrder(cat);
			const subBySlug = new Map(
				cat.subSections.map((sub) => [sub.slug, sub])
			);
			const presetBySlug = new Map(
				cat.directPresets.map((preset) => [
					String(preset.slug ?? ''),
					preset,
				])
			);
			return childOrder.map((ref) => {
				if (ref.kind === 'preset') {
					const preset = presetBySlug.get(ref.slug);
					if (!preset) {
						return null;
					}
					return renderPopoverRow(preset, ref.slug);
				}
				const sub = subBySlug.get(ref.slug);
				if (!sub) {
					return null;
				}
				return renderCategorySubSection(group, cat, sub);
			});
		},
		[renderCategorySubSection, renderPopoverRow]
	);

	const renderCategory = useCallback(
		(
			group: TaxonomyGroupBranch<TPreset>,
			cat: TaxonomyCategoryBranch<TPreset>
		) => {
			const soleInCategory = getSolePresetInCategory(cat);
			if (soleInCategory !== undefined) {
				return renderPopoverRow(
					soleInCategory,
					`${group.slug}-${cat.slug}-${String(soleInCategory.slug ?? '')}`
				);
			}
			const categoryPresetsForPreview =
				collectTaxonomyCategoryPresets(cat);
			const shouldShowClosedPreview =
				Boolean(renderTaxonomyCategoryClosedPreview) &&
				categoryPresetsForPreview.length > 0;
			return (
				<TaxonomyCategoryAccordion
					key={`${group.slug}-${cat.slug}`}
					title={cat.name}
					{...(cat.initialOpen !== undefined
						? { defaultOpen: cat.initialOpen }
						: {})}
					showPreview={
						shouldShowClosedPreview ||
						cat.showPreview ||
						augmentPreview(categoryPresetsForPreview, fullItems)
					}
					renderClosedHeaderPreview={
						renderTaxonomyCategoryClosedPreview
							? () =>
									renderTaxonomyCategoryClosedPreview(
										categoryPresetsForPreview
									)
							: undefined
					}
				>
					{renderCategoryChildren(group, cat)}
				</TaxonomyCategoryAccordion>
			);
		},
		[
			augmentPreview,
			fullItems,
			renderCategoryChildren,
			renderPopoverRow,
			renderTaxonomyCategoryClosedPreview,
		]
	);

	return (
		<div
			className={controlClassNames(
				'repeater',
				'design-minimal',
				'blockera-preset-taxonomy-repeater'
			)}
			data-cy="blockera-repeater-control"
		>
			{tree.map((group) => {
				const childOrder = group.childOrder?.length
					? group.childOrder
					: defaultGroupChildOrder(group);
				const presetBySlug = new Map(
					group.directPresets.map((preset) => [
						String(preset.slug ?? ''),
						preset,
					])
				);
				const categoryBySlug = new Map(
					group.categories.map((cat) => [cat.slug, cat])
				);
				return (
					<div
						key={group.slug}
						className="blockera-preset-taxonomy-group-shell"
						data-test="preset-taxonomy-group-shell"
					>
						<TaxonomyGroupHeader label={group.name} />
						<div className="blockera-preset-taxonomy-items-stack">
							{childOrder.map((ref) => {
								if (ref.kind === 'preset') {
									const preset = presetBySlug.get(ref.slug);
									if (!preset) {
										return null;
									}
									return renderPopoverRow(preset, ref.slug);
								}
								const cat = categoryBySlug.get(ref.slug);
								if (!cat) {
									return null;
								}
								return renderCategory(group, cat);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
}
