// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { memo, useState, useEffect } from '@wordpress/element';
import { __experimentalVStack as VStack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { difference, union, without, isEquals } from '@blockera/utils';
import { type TabsComponentsProps, PanelHeader } from '@blockera/wordpress';

/**
 * Internal dependencies
 */
import BlockCategory from './block-category';

export const BlockManagerPanel = ({
	tab,
	settings,
	description,
	setSettings,
}: TabsComponentsProps): MixedElement => {
	const savedDisabledBlocks = settings?.disabledBlocks || [];
	const [disabledBlocks, setDisabledBlocks] = useState(savedDisabledBlocks);

	useEffect(() => {
		if (isEquals(savedDisabledBlocks, disabledBlocks)) {
			return;
		}

		setDisabledBlocks(savedDisabledBlocks);
		// eslint-disable-next-line
	}, [savedDisabledBlocks]);

	const { getCategories, getBlockTypes, hasBlockSupport } =
		select('core/blocks');
	const categories = getCategories();
	const blockTypes = getBlockTypes();
	const {
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

	const [hasUpdate, setHasUpdates] = useState(false);
	const updateDisabledBlocks = (_disabledBlocks: Array<string>): void => {
		setDisabledBlocks(_disabledBlocks);
		setHasUpdates(true);
	};
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

		updateDisabledBlocks(currentDisabledBlocks);
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

		updateDisabledBlocks(currentDisabledBlocks);
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
		<>
			<PanelHeader
				tab={tab}
				defaultValue={[]}
				hasUpdate={hasUpdate}
				tabSettings={disabledBlocks}
				onUpdate={(_hasUpdate: boolean): void => {
					setHasUpdates(_hasUpdate);

					setSettings({
						...settings,
						disabledBlocks,
					});
				}}
				description={description}
			/>
			<VStack className={'blockera-settings-panel-container'}>
				<Categories />
			</VStack>
		</>
	);
};
