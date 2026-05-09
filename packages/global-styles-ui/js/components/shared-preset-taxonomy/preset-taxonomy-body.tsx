/**
 * External dependencies
 */
import type { ElementType, ReactNode } from 'react';
import { useCallback, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex, RepeaterContext } from '@blockera/controls';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { PresetFieldsPropsResolver } from '../preset-group';
import type { TaxonomyGroupBranch } from '../preset-taxonomy/types';
import {
	TaxonomyCategoryAccordion,
	TaxonomyGroupHeader,
} from '../preset-taxonomy-ui';
import { usePresetVariationsStorage } from '../../context/preset-variations-context';
import { PresetTaxonomyPopoverRow } from './preset-taxonomy-popover-row';
import { findRepeaterItemIdBySlug } from './preset-taxonomy-utils';

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
					<Flex
						direction="column"
						gap="var(--repeater-gap, 8px)"
						className="blockera-preset-taxonomy-items-stack"
						style={{ width: '100%' }}
					>
						{group.directPresets.map((preset) => (
							<PresetTaxonomyPopoverRow
								key={String(preset.slug)}
								item={preset}
								itemId={resolveItemId(
									String(preset.slug ?? '')
								)}
								origin={origin}
								PresetFields={PresetFields}
								repeaterItemHeader={repeaterItemHeader}
								presetFieldsPropsResolver={
									presetFieldsPropsResolver
								}
							/>
						))}
						{group.categories.map((cat) => (
							<TaxonomyCategoryAccordion
								key={`${group.slug}-${cat.slug}`}
								title={cat.name}
								showPreview={
									cat.showPreview ||
									augmentPreview(cat.directPresets, fullItems)
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
								{cat.directPresets.map((preset) => (
									<PresetTaxonomyPopoverRow
										key={String(preset.slug)}
										item={preset}
										itemId={resolveItemId(
											String(preset.slug ?? '')
										)}
										origin={origin}
										PresetFields={PresetFields}
										repeaterItemHeader={repeaterItemHeader}
										presetFieldsPropsResolver={
											presetFieldsPropsResolver
										}
									/>
								))}
								{cat.subSections.map((sub) => (
									<TaxonomyCategoryAccordion
										key={`${group.slug}-${cat.slug}-${sub.slug}`}
										title={sub.name}
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
										{sub.presets.map((preset) => (
											<PresetTaxonomyPopoverRow
												key={String(preset.slug)}
												item={preset}
												itemId={resolveItemId(
													String(preset.slug ?? '')
												)}
												origin={origin}
												PresetFields={PresetFields}
												repeaterItemHeader={
													repeaterItemHeader
												}
												presetFieldsPropsResolver={
													presetFieldsPropsResolver
												}
											/>
										))}
									</TaxonomyCategoryAccordion>
								))}
							</TaxonomyCategoryAccordion>
						))}
					</Flex>
				</div>
			))}
		</div>
	);
}
