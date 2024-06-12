// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { ControlContextProvider, ToggleControl } from '@blockera/controls';

/**
 * Renders an individual list item and checkbox control for a given block type
 * on the Block Manager tab of the Blockera settings page.
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 */
export default function BlockType(props: Object): MixedElement {
	const { blockType, disabledBlocks, handleBlockTypeChange } = props;
	const isChecked = !disabledBlocks.includes(blockType.name);

	const onBlockTypeChange = (checked: boolean): void => {
		handleBlockTypeChange(checked, blockType.name);
	};

	return (
		<div className={'blockera-block-category-item'}>
			<HStack
				justifyContent={'space-between'}
				className={'blockera-block-manage'}
			>
				<div className={'blockera-block'}>
					<span className={'blockera-block-icon'}>
						{blockType.icon.src}
					</span>
					<h4 className={'blockera-block-type'}>{blockType.title}</h4>
				</div>
				<div className={'blockera-block-control'}>
					<ControlContextProvider
						value={{
							name: `toggle${blockType.name.replace('/', '_')}`,
							value: isChecked,
						}}
					>
						<ToggleControl
							// TODO: Convert to advanced labelType. to display for user is changed value or not!
							labelType={'self'}
							id={`toggle${blockType.name.replace('/', '_')}`}
							defaultValue={isChecked}
							onChange={onBlockTypeChange}
						/>
					</ControlContextProvider>
				</div>
			</HStack>
		</div>
	);
}
