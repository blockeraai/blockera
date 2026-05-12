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
	TaxonomyGroupBranch,
} from '../preset-taxonomy/types';
import { usePresetVariationsStorage } from '../../context/preset-variations-context';
import { TaxonomyCategoryAccordion } from './taxonomy-category-accordion';
import { TaxonomyGroupHeader } from './taxonomy-group-header';
import { PresetTaxonomyPopoverRow } from './preset-taxonomy-popover-row';
import { findRepeaterItemIdBySlug } from './preset-taxonomy-utils';

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

	return (
		<div
			className={controlClassNames(
				'repeater',
				'design-minimal',
				'blockera-preset-taxonomy-repeater'
			)}
			data-cy="blockera-repeater-control"
		>
			{tree.map((group) => (
				<div
					key={group.slug}
					className="blockera-preset-taxonomy-group-shell"
				>
					<TaxonomyGroupHeader label={group.name} />
					<div className="blockera-preset-taxonomy-items-stack">
						{group.directPresets.map((preset) =>
							renderPopoverRow(preset, String(preset.slug ?? ''))
						)}
						{group.categories.map((cat) => {
							const soleInCategory = getSolePresetInCategory(cat);
							if (soleInCategory !== undefined) {
								return renderPopoverRow(
									soleInCategory,
									`${group.slug}-${cat.slug}-${String(soleInCategory.slug ?? '')}`
								);
							}
							return (
								<TaxonomyCategoryAccordion
									key={`${group.slug}-${cat.slug}`}
									title={cat.name}
									{...(cat.initialOpen !== undefined
										? { defaultOpen: cat.initialOpen }
										: {})}
									showPreview={
										cat.showPreview ||
										augmentPreview(
											cat.directPresets,
											fullItems
										)
									}
									renderClosedHeaderPreview={
										renderTaxonomyCategoryClosedPreview
											? () =>
													renderTaxonomyCategoryClosedPreview(
														cat.directPresets
													)
											: undefined
									}
								>
									{cat.directPresets.map((preset) =>
										renderPopoverRow(
											preset,
											String(preset.slug ?? '')
										)
									)}
									{cat.subSections.map((sub) =>
										sub.presets.length === 1 ? (
											renderPopoverRow(
												sub.presets[0],
												`${group.slug}-${cat.slug}-${sub.slug}-${String(sub.presets[0].slug ?? '')}`
											)
										) : (
											<TaxonomyCategoryAccordion
												key={`${group.slug}-${cat.slug}-${sub.slug}`}
												title={sub.name}
												{...(sub.initialOpen !==
												undefined
													? {
															defaultOpen:
																sub.initialOpen,
														}
													: {})}
												showPreview={
													sub.showPreview ||
													augmentPreview(
														sub.presets,
														fullItems
													)
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
													renderPopoverRow(
														preset,
														String(
															preset.slug ?? ''
														)
													)
												)}
											</TaxonomyCategoryAccordion>
										)
									)}
								</TaxonomyCategoryAccordion>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
