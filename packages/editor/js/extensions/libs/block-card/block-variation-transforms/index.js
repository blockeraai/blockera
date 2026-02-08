//@flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { store as blocksStore } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { hasContentRoleAttribute } from './utils';
import { useBlockContext } from '../../../components/block-context';
import { getAttributesWithIds } from '../../../../hooks/use-attributes';
import { default as VariationsDropdown } from './components/variation-drop-down';
import { default as VariationsToggleSelectControl } from './components/variation-toggle-select';

export default function BlockVariationTransforms({
	blockClientId,
}: {
	blockClientId: string,
}): MixedElement {
	const { handleOnChangeAttributes } = useBlockContext();

	const {
		name,
		attributes,
		activeBlockVariation,
		variations,
		isContentOnly,
	} = useSelect(
		(select) => {
			const { getActiveBlockVariation, getBlockVariations } =
				select(blocksStore);

			const { getBlockName, getBlockAttributes, getBlockEditingMode } =
				select(blockEditorStore);

			const name = blockClientId && getBlockName(blockClientId);

			const isContentBlock = hasContentRoleAttribute(name);

			return {
				name,
				attributes: getBlockAttributes(blockClientId),
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

	const selectedValue =
		activeBlockVariation?.name || name.replace('core/', '');

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
		handleOnChangeAttributes(
			'blockeraPropsId',
			getAttributesWithIds(attributes, 'blockeraPropsId', true)
				?.blockeraPropsId,
			{
				effectiveItems: variations.find(
					({ name }) => name === variationName
				).attributes,
			}
		);
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
