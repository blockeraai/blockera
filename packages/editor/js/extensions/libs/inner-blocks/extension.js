// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useMemo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';
import { dispatch, useSelect, select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { mergeObject, isString } from '@blockera/utils';
import {
	RepeaterControl,
	PanelBodyControl,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../../components';
import type {
	InnerBlockModel,
	InnerBlockType,
	InnerBlocksProps,
} from './types';
import ItemHeader from './components/item-header';
import { Inserter } from './components/inserter';
import { generateExtensionId } from '../utils';
import { isBlock, isElement } from './helpers';
import { AvailableBlocksAndElements } from './components/avialable-blocks-and-elements';

export const InnerBlocksExtension: ComponentType<InnerBlocksProps> = memo(
	({
		block,
		values,
		onChange,
		innerBlocks,
	}: InnerBlocksProps): MixedElement => {
		// External selectors. to access registered block types on WordPress blocks store api.
		const { getBlockType, getBlockTypes } = select('core/blocks');
		const registeredAllBlocks = getBlockTypes();
		const {
			allowedBlocks = null,
			attributes: { allowedBlocks: allowedBlocksAttribute = null },
		} = getBlockType(block.blockName) || {};

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
		const memoizedInnerBlocks = useMemo(() => {
			const stack: { [key: InnerBlockType]: InnerBlockModel } = {};

			// $FlowFixMe
			for (const name: InnerBlockType in values) {
				const registeredBlockType = getBlockType(name);

				if (registeredBlockType) {
					stack[name] = mergeObject(
						{
							...registeredBlockType,
							label:
								registeredBlockType?.title ||
								innerBlocks[name]?.label ||
								'',
							icon: registeredBlockType?.icon?.src ||
								innerBlocks[name]?.icon || <></>,
						},
						values[name]
					);

					continue;
				}

				stack[name] = mergeObject(innerBlocks[name], values[name]);
			}

			// Previous inner blocks stack.
			const inners = getBlockInners(block.clientId);

			setBlockClientInners({
				clientId: block.clientId,
				inners: mergeObject(inners, stack),
			});

			return stack;
			// eslint-disable-next-line
		}, [values, innerBlocks]);

		// Calculation: to categorized in two category (elements and blocks) from available inner blocks on current WordPress selected block.
		const { elements, blocks } = useMemo(() => {
			const blocks: Array<InnerBlockModel> = [];
			const elements: Array<InnerBlockModel> = [];

			Object.keys(innerBlocks).forEach(
				(innerBlockType: InnerBlockType | string) => {
					const innerBlock: InnerBlockModel =
						innerBlocks[innerBlockType];

					if (isElement(innerBlock)) {
						elements.push(innerBlock);
					} else if (isBlock(innerBlock)) {
						blocks.push(innerBlock);
					}
				}
			);

			const appendBlocks = (stack: Array<any>) => {
				stack.forEach((innerBlock: any) => {
					const blockType = getBlockType(
						isString(innerBlock) ? innerBlock : innerBlock.name
					);

					if (
						!memoizedInnerBlocks[blockType?.name] &&
						!blocks.find((block) => block.name === blockType?.name)
					) {
						blocks.push({
							...blockType,
							icon: blockType?.icon?.src ||
								innerBlocks[blockType.name]?.icon || <></>,
							label:
								blockType?.title ||
								innerBlocks[blockType.name]?.label,
						});
					}
				});
			};

			if (allowedBlocks && allowedBlocks.length) {
				appendBlocks(allowedBlocks);
			} else if (
				allowedBlocksAttribute &&
				!allowedBlocksAttribute?.default
			) {
				appendBlocks(Object.values(registeredAllBlocks));
			}

			// Appending inserted inners in WordPress selected block ...
			appendBlocks(insertedInnerBlocks);

			return { elements, blocks };
			// eslint-disable-next-line
		}, [innerBlocks, insertedInnerBlocks, memoizedInnerBlocks]);

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
			attribute: 'values',
			blockName: block.blockName,
			name: generateExtensionId(block, 'inner-blocks', false),
		};

		// Calculation: repeater maxItems property.
		const maxItems = Object.keys(availableBlocks).length;

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
							id: 'inner-blocks',
							// FIXME: temporarily, we sets count all of block supported inner items as maxItems, we needs to specific maxItems for free version!
							maxItems,
							selectable: true,
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
						addNewButtonLabel={__('Add New Block', 'blockera')}
						label={__('Blocks & Elements', 'blockera')}
						popoverTitle={__('Blocks & Elements', 'blockera')}
						className={controlInnerClassNames(
							'inner-blocks-repeater'
						)}
						itemColumns={2}
						design={'minimal'}
						actionButtonClone={false}
						actionButtonVisibility={false}
					/>
				</ControlContextProvider>
			</PanelBodyControl>
		);
	}
);
