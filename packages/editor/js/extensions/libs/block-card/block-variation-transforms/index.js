//@flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { store as blocksStore } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { default as VariationsDropdown } from './components/variation-drop-down';
import { default as VariationsToggleSelectControl } from './components/variation-toggle-select';
import { hasContentRoleAttribute } from './utils';

export default function BlockVariationTransforms({
	blockClientId,
}: {
	blockClientId: string,
}): MixedElement {
	const { updateBlockAttributes } = useDispatch(blockEditorStore);

	const { activeBlockVariation, variations, isContentOnly } = useSelect(
		(select) => {
			const { getActiveBlockVariation, getBlockVariations } =
				select(blocksStore);

			const { getBlockName, getBlockAttributes, getBlockEditingMode } =
				select(blockEditorStore);

			const name = blockClientId && getBlockName(blockClientId);

			const isContentBlock = hasContentRoleAttribute(name);

			return {
				activeBlockVariation: getActiveBlockVariation(
					name,
					getBlockAttributes(blockClientId)
				),
				variations: name && getBlockVariations(name, 'transform'),
				isContentOnly:
					getBlockEditingMode(blockClientId) === 'contentOnly' &&
					!isContentBlock,
			};
		},
		[blockClientId]
	);

	const selectedValue = activeBlockVariation?.name;

	// Check if each variation has a unique icon.
	const hasUniqueIcons = useMemo(() => {
		const variationIcons = new Set<string>();

		if (!variations) {
			return false;
		}

		variations.forEach((variation) => {
			if (variation.icon) {
				variationIcons.add(variation.icon?.src || variation.icon);
			}
		});

		return variationIcons.size === variations.length;
	}, [variations]);

	const onSelectVariation = (variationName: string) => {
		updateBlockAttributes(blockClientId, {
			...variations.find(({ name }) => name === variationName).attributes,
		});
	};

	if (!variations?.length || isContentOnly) {
		return <></>;
	}

	const baseClass = 'blockera-block-variation-transforms';

	const Component = hasUniqueIcons
		? VariationsToggleSelectControl
		: VariationsDropdown;

	return (
		<Component
			className={baseClass}
			onSelectVariation={onSelectVariation}
			selectedValue={selectedValue}
			variations={variations}
		/>
	);
}
