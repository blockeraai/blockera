// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { dispatch, useSelect } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import {
	RepeaterControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import type { InnerBlocksProps } from './types';
import { Inserter } from './components/inserter';
import ItemHeader from './components/item-header';
import { isInnerBlock, useBlockSection } from '../../components';
import { useAvailableItems, useMemoizedInnerBlocks } from './hooks';
import { AvailableBlocksAndElements } from './components/available-blocks-and-elements';

export const InnerBlocksExtension: ComponentType<InnerBlocksProps> = memo(
	({
		block,
		values,
		onChange,
		innerBlocks,
	}: InnerBlocksProps): MixedElement => {
		const { initialOpen, onToggle } = useBlockSection('innerBlocksConfig');

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
			<PanelBodyControl
				onToggle={onToggle}
				title={__('Inner Blocks', 'blockera')}
				initialOpen={initialOpen}
				icon={<Icon icon="extension-inner-blocks" />}
				className={extensionClassNames('inner-blocks')}
			>
				<ControlContextProvider
					value={contextValue}
					storeName={'blockera/controls/repeater'}
				>
					<RepeaterControl
						{...{
							maxItems,
							selectable: true,
							id: 'inner-blocks',
							isSupportInserter: true,
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
									}
								}
							},
							InserterComponent: (props: Object) => (
								<Inserter
									{...{
										...props,
										maxItems,
										AvailableBlocks: () => (
											<AvailableBlocksAndElements
												blocks={blocks}
												elements={elements}
												setCurrentBlock={
													setCurrentBlock
												}
												setBlockClientInners={
													setBlockClientInners
												}
												clientId={block?.clientId}
												getBlockInners={getBlockInners}
											/>
										),
									}}
								/>
							),
							repeaterItemChildren: () => {},
							repeaterItemHeader: ItemHeader,
						}}
						defaultValue={{}}
						label={__('Inner Blocks', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'By using inner blocks, you can group blocks together and customize them in a single place without the need to customize the block itself.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'The customization is attached to the parent block and will be applied to all nested blocks.',
										'blockera'
									)}
								</p>
								<p>
									{__(
										'Some blocks have the `Virtual Inner Blocks` that are not real blocks but elements that are inside the block and you can use them for more customization.',
										'blockera'
									)}
								</p>
							</>
						}
						addNewButtonLabel={__('Add Inner Block', 'blockera')}
						popoverTitle={__(
							'Inner Blocks Customization',
							'blockera'
						)}
						className={controlInnerClassNames(
							'inner-blocks-repeater'
						)}
						icon={<Icon icon="inner-blocks" />}
						description={__(
							'Customize nested blocks style.',
							'blockera'
						)}
						design="large"
						actionButtonClone={false}
						actionButtonVisibility={false}
					/>
				</ControlContextProvider>
			</PanelBodyControl>
		);
	}
);
