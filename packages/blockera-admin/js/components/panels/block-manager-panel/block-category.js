// @flow

/**
 * External dependencies
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { without } from '@blockera/utils';
import { Button } from '@blockera/components';

/**
 * Internal dependencies
 */
import BlockType from './block-type';

/**
 * Renders the list of BlockType controls for a given block category on the
 * Block Manager tab of the Block Visibility settings page.
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 */
export default function BlockCategory(props: {
	category: {
		name: string,
		slug: string,
		title: string,
	},
	blockTypes: Array<Object>,
	disabledBlocks: Array<string>,
	handleBlockTypeChange: (checked: boolean, blockName: string) => void,
	handleBlockCategoryChange: (
		checked: boolean,
		blockNames: Array<string>
	) => void,
}): MixedElement | null {
	const {
		category,
		blockTypes,
		disabledBlocks,
		handleBlockTypeChange,
		handleBlockCategoryChange,
	} = props;
	const blockNames: Array<string> = blockTypes.map(
		(blockType) => blockType.name
	);
	const onBlockCategoryChange = (checked: boolean): void => {
		handleBlockCategoryChange(checked, blockNames);
	};

	// If category has no blocks, abort.
	if (!blockTypes.length) {
		return null;
	}

	const checkedBlockNames = without(blockNames, disabledBlocks);
	const isAllChecked = checkedBlockNames.length === blockNames.length;

	return (
		<>
			<HStack
				key={category.slug}
				justifyContent={'space-between'}
				className={'blockera-block-category'}
			>
				<div
					className={
						'blockera-block-category blockera-block-category'
					}
				>
					<h4 className={'blockera-block-category-name'}>
						{category.title}
					</h4>
				</div>
				<div className={'blockera-block-category-buttons'}>
					<Button
						className={classnames(
							'blockera-block-category-button',
							{
								'is-active': isAllChecked,
							}
						)}
						text={__('Disable All', 'blockera')}
						onClick={() => onBlockCategoryChange(false)}
					/>
					<Button
						className={classnames(
							'blockera-block-category-button',
							{
								'is-active': !isAllChecked,
							}
						)}
						text={__('Enable All', 'blockera')}
						onClick={() => onBlockCategoryChange(true)}
					/>
				</div>
			</HStack>
			<HStack
				justifyContent={'space-between'}
				className={'blockera-block-category-items'}
			>
				{blockTypes.map((blockType, index) => {
					return (
						<BlockType
							key={index}
							blockType={blockType}
							disabledBlocks={disabledBlocks}
							handleBlockTypeChange={handleBlockTypeChange}
						/>
					);
				})}
			</HStack>
		</>
	);
}
