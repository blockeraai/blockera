// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { memo, useContext } from '@wordpress/element';
import { __experimentalVStack as VStack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { SettingsContext, TabsContext } from '@blockera/wordpress';
import { difference, union, without, isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import BlockCategory from './block-category';

export const BlockManagerPanel = (): MixedElement => {
	const { defaultSettings } = useContext(SettingsContext);
	const { settings, setSettings, setHasUpdates } = useContext(TabsContext);
	const disabledBlocks =
		settings?.disabledBlocks || defaultSettings?.disabledBlocks || [];

	const { getCategories, getBlockTypes, hasBlockSupport } =
		select('core/blocks');
	const categories = getCategories();
	const blockTypes = getBlockTypes();
	const {
		blockeraSettings: { disabledBlocks: savedDisabledBlocks },
		unstableBootstrapServerSideBlockTypes: blockeraSupportedBlockTypes,
	} = window;

	let allowedBlockTypes = blockeraSupportedBlockTypes
		.filter((blockType) => {
			const blockTypeObj = blockTypes.filter(
				(_blockType) => _blockType.name === blockType
			);

			return (
				hasBlockSupport(blockTypeObj, 'inserter', true) &&
				!blockTypeObj.parent
			);
		})
		.map(
			(blockType) =>
				blockTypes.filter(
					(_blockType) => _blockType.name === blockType
				)[0]
		)
		.filter((blockType) => blockType);

	// Blocks present in the Block Editor that do not accept custom attributes.
	const incompatibleBlockTypes = ['core/freeform'];

	// Remove all incompatible blocks from the allowed block types.
	allowedBlockTypes = allowedBlockTypes.filter(
		(blockType) => !incompatibleBlockTypes.includes(blockType.name)
	);

	const handleBlockCategoryChange = (
		checked: boolean,
		blockTypeNames: Array<string>
	): void => {
		let currentDisabledBlocks = [...disabledBlocks];

		if (!checked) {
			currentDisabledBlocks = union(
				currentDisabledBlocks,
				blockTypeNames
			);
		} else {
			currentDisabledBlocks = difference(
				currentDisabledBlocks,
				blockTypeNames
			);
		}

		setSettings({
			...settings,
			disabledBlocks: currentDisabledBlocks,
		});

		setHasUpdates(!isEquals(currentDisabledBlocks, savedDisabledBlocks));
	};
	const handleBlockTypeChange = (
		checked: boolean,
		blockTypeName: string
	): void => {
		let currentDisabledBlocks = [...disabledBlocks];

		if (!checked) {
			currentDisabledBlocks.push(blockTypeName);
		} else {
			currentDisabledBlocks = without(
				currentDisabledBlocks,
				blockTypeName
			);
		}

		setSettings({
			...settings,
			disabledBlocks: currentDisabledBlocks,
		});

		setHasUpdates(!isEquals(currentDisabledBlocks, savedDisabledBlocks));
	};

	const Categories = memo(() =>
		categories.map((category): MixedElement => {
			const filteredBlockTypes = allowedBlockTypes.filter(
				(blockType) => category.slug === blockType.category
			);

			if (!filteredBlockTypes.length) {
				return <></>;
			}

			return (
				<BlockCategory
					key={category.slug}
					category={category}
					disabledBlocks={disabledBlocks}
					blockTypes={filteredBlockTypes}
					handleBlockTypeChange={handleBlockTypeChange}
					handleBlockCategoryChange={handleBlockCategoryChange}
				/>
			);
		})
	);

	return (
		<VStack className={'blockera-settings-panel-container'}>
			<Categories />
		</VStack>
	);
};
