/**
 * External dependencies
 */
import type { ElementType, ReactNode } from 'react';
import { useCallback, useContext } from '@wordpress/element';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { Flex, RepeaterContext } from '@blockera/controls';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { PresetFieldsPropsResolver } from '../components/preset-group';
import type { TaxonomyGroupBranch } from '../components/preset-taxonomy/types';
import {
	TaxonomyCategoryAccordion,
	TaxonomyGroupHeader,
} from '../components/preset-taxonomy-ui';
import { PresetTaxonomyPopoverRow } from '../components/shared-preset-taxonomy';
import { findRepeaterItemIdBySlug } from './utils';
import { usePresetVariationsStorage } from '../context/preset-variations-context';
import { taxonomyCategoryHasBaseWithShadeVariations } from './color-taxonomy-category-closed-preview';

export type ColorPresetTaxonomyBodyProps = {
	tree: TaxonomyGroupBranch<Color & Record<string, unknown>>[];
	origin: string;
	PresetFields: ElementType;
	repeaterItemHeader: ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	renderTaxonomyCategoryClosedPreview?: (
		presets: Array<Color & Record<string, unknown>>
	) => ReactNode;
};

export function ColorPresetTaxonomyBody({
	tree,
	origin,
	PresetFields,
	repeaterItemHeader,
	presetFieldsPropsResolver,
	renderTaxonomyCategoryClosedPreview,
}: ColorPresetTaxonomyBodyProps) {
	const { repeaterItems } = useContext(RepeaterContext) as {
		repeaterItems?: Record<string, { slug?: string }>;
	};
	const { fullItems } = usePresetVariationsStorage<Color>();

	const resolveItemId = useCallback(
		(slug: string) => findRepeaterItemIdBySlug(repeaterItems, slug) ?? slug,
		[repeaterItems]
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
									taxonomyCategoryHasBaseWithShadeVariations(
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
											taxonomyCategoryHasBaseWithShadeVariations(
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
