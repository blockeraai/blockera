// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';
import { dispatch, useSelect, select } from '@wordpress/data';

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
import { isInnerBlock } from '../../components';
import type { InnerBlocksProps } from './types';
import { Inserter } from './components/inserter';
import ItemHeader from './components/item-header';
import { useAvailableItems, useMemoizedInnerBlocks } from './hooks';
import { AvailableBlocksAndElements } from './components/available-blocks-and-elements';

export const InnerBlocksExtension: ComponentType<InnerBlocksProps> = memo(
	({
		block,
		values,
		onChange,
		innerBlocks,
	}: InnerBlocksProps): MixedElement => {
		// External selectors. to access selected block type on WordPress editor store api.
		const { getSelectedBlock } = select('core/block-editor');
		const { innerBlocks: insertedInnerBlocks = [] } =
			getSelectedBlock() || {};

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
			insertedInnerBlocks,
			memoizedInnerBlocks,
			setBlockClientInners,
			clientId: block?.clientId,
			reservedInnerBlocks: innerBlocks,
			selectedBlockName: block?.blockName,
		});

		// Merging all categories, as available blocks.
		const availableBlocks = [...elements, ...blocks];

		// Get repeater value from internal Blockera store api.
		const value = getBlockInners(block.clientId);

		if (
			!Object.keys(innerBlocks).length ||
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
		const maxItems = availableBlocks.length;

		return (
			<PanelBodyControl
				title={__('Inner Blocks', 'blockera')}
				initialOpen={false}
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

										setCurrentBlock(item.name);
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
							repeaterItemHeader: ItemHeader,
						}}
						defaultValue={{}}
						label={__('Inner Blocks', 'blockera')}
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
							'Customize inner blocks style.',
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
