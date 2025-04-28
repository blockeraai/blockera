// @flow

/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
import { dispatch, useSelect } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import { RepeaterControl, ControlContextProvider } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import type { InnerBlocksProps } from './types';
import ItemHeader from './components/item-header';
import { isInnerBlock, useBlockSection } from '../../components';
import { useAvailableItems, useMemoizedInnerBlocks } from './hooks';

export const InnerBlocksExtension: ComponentType<InnerBlocksProps> = memo(
	({
		block,
		values,
		onChange,
		innerBlocks,
	}: InnerBlocksProps): MixedElement => {
		const { onToggle } = useBlockSection('innerBlocksConfig');

		// Internal selectors. to access current selected block and inner blocks stack of Blockera editor/extensions store api.
		const { currentBlock = 'master', getBlockInners } = useSelect(
			(select) => {
				const { getBlockInners, getExtensionCurrentBlock } = select(
					'blockera/extensions'
				);

				return {
					getBlockInners,
					currentBlock: getExtensionCurrentBlock(),
				};
			}
		);

		// Internal dispatchers. to use of "setCurrentBlock" and "setBlockClientInners" dispatchers of Blockera editor/extensions store api.
		const {
			changeExtensionCurrentBlock: setCurrentBlock,
			setBlockClientInners,
		} = dispatch('blockera/extensions') || {};

		// Calculation: to prepare standard values for "blockeraInnerBlocks" block attribute with set initial value for repeater by "setBlockClientInners" dispatcher.
		const memoizedInnerBlocks = useMemoizedInnerBlocks({
			getBlockInners,
			setBlockClientInners,
			controlValue: values,
			clientId: block?.clientId,
			reservedInnerBlocks: innerBlocks,
		});

		// Calculation: to categorized in two category (elements and blocks) from available inner blocks on current WordPress selected block.
		const { elements, blocks } = useAvailableItems({
			getBlockInners,
			memoizedInnerBlocks,
			setBlockClientInners,
			clientId: block?.clientId,
			reservedInnerBlocks: innerBlocks,
		});

		// Merging all categories, as available blocks.
		const availableBlocks = [...elements, ...blocks];

		// Get repeater value from internal Blockera store api.
		const value = getBlockInners(block.clientId);

		// cache length to not calculate it multiple times
		const innerBlocksLength = Object.keys(innerBlocks).length;

		if (
			!innerBlocksLength ||
			(!availableBlocks.length && !Object.keys(value).length) ||
			isInnerBlock(currentBlock)
		) {
			return <></>;
		}

		// Assign control context provider value.
		const contextValue = {
			block,
			value,
			blockName: block.blockName,
			attribute: 'blockeraInnerBlocks',
			name: generateExtensionId(block, 'inner-blocks', false),
		};

		// Calculation: repeater maxItems property.
		const maxItems = innerBlocksLength;

		return (
			<ControlContextProvider
				value={contextValue}
				storeName={'blockera/controls/repeater'}
			>
				<RepeaterControl
					{...{
						maxItems,
						selectable: true,
						id: 'inner-blocks',
						actionButtonAdd: false,
						onDelete: (itemId, items) => {
							delete values[itemId];
							delete items[itemId];

							onChange('values', values, {});

							const newValue = mergeObject(values, items);

							setBlockClientInners({
								clientId: block?.clientId,
								inners: newValue,
							});

							return newValue;
						},
						onChange: (newValue: Object) => {
							if (newValue?.value) {
								const items = newValue?.value || {};

								for (const name in items) {
									const item = items[name];

									if (!item?.isSelected) {
										continue;
									}

									setCurrentBlock(name);
									onToggle(true, 'switch-to-inner', name);
								}
							}
						},
						repeaterItemChildren: () => {},
						repeaterItemHeader: ItemHeader,
					}}
					defaultValue={{}}
					className={controlInnerClassNames('inner-blocks-repeater')}
					actionButtonClone={false}
					actionButtonVisibility={false}
				/>
			</ControlContextProvider>
		);
	}
);
