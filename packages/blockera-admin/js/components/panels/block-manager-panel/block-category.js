// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { without } from '@blockera/utils';
import { Button, Flex, Grid } from '@blockera/controls';
import { componentInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import BlockType from './block-type';

/**
 * Renders the list of BlockType controls for a given block category on the
 * Block Manager tab of the Blockera settings page.
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

	function getCategoryIcon(id: string): MixedElement {
		switch (id) {
			case 'text':
				return (
					<Icon
						library="ui"
						icon="extension-typography"
						iconSize="24"
					/>
				);

			case 'media':
				return (
					<Icon
						library="ui"
						icon="extension-background"
						iconSize="24"
					/>
				);

			case 'design':
				return (
					<Icon library="ui" icon="extension-effects" iconSize="24" />
				);

			default:
				return (
					<Icon
						library="ui"
						icon="extension-advanced"
						iconSize="24"
					/>
				);
		}
	}

	return (
		<>
			<Flex
				key={category.slug}
				alignItems={'flex-start'}
				justifyContent={'space-between'}
				className={'blockera-block-category'}
			>
				<div className={'blockera-block-category'}>
					<h4 className={'blockera-block-category-name'}>
						{getCategoryIcon(category.slug)}

						{category.title}
					</h4>
				</div>

				<div
					className={componentInnerClassNames(
						'block-category-buttons'
					)}
				>
					<Button
						className={componentInnerClassNames(
							'block-category-button',
							{
								'is-active': isAllChecked,
							}
						)}
						data-test={`${category.slug}-category=disable`}
						text={__('Disable All', 'blockera')}
						onClick={() => onBlockCategoryChange(false)}
						variant={'tertiary-on-hover'}
					/>

					<Button
						className={componentInnerClassNames(
							'block-category-button',
							{
								'is-active': !isAllChecked,
							}
						)}
						data-test={`${category.slug}-category=enable`}
						text={__('Enable All', 'blockera')}
						onClick={() => onBlockCategoryChange(true)}
						variant={'tertiary-on-hover'}
					/>
				</div>
			</Flex>

			<Grid
				gridTemplateColumns={'repeat(3, 1fr)'}
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
			</Grid>
		</>
	);
}
