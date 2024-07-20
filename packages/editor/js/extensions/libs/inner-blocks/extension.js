// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useMemo, useCallback } from '@wordpress/element';
import { dispatch, useSelect } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	classNames,
	extensionClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { mergeObject, hasSameProps } from '@blockera/utils';
import {
	Flex,
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
import ItemBody from './components/item-body';
// import ItemOpener from './components/item-opener';
import { Inserter } from './components/inserter';
import { generateExtensionId } from '../utils';
import { isBlock, isElement } from './helpers';
import { useBlockContext } from '../../hooks';

export const InnerBlocksExtension: ComponentType<InnerBlocksProps> = memo(
	({ innerBlocks, block, onChange }: InnerBlocksProps): MixedElement => {
		const { getAttributes } = useBlockContext();
		const { blockeraInnerBlocks } = getAttributes();
		const memoizedInnerBlocks = useMemo(() => {
			const stack: { [key: InnerBlockType]: InnerBlockModel } = {};

			// $FlowFixMe
			for (const name: InnerBlockType in blockeraInnerBlocks) {
				stack[name] = mergeObject(
					innerBlocks[name],
					blockeraInnerBlocks[name]
				);
			}

			return stack;
		}, [blockeraInnerBlocks, innerBlocks]);
		const { elements, blocks } = useMemo(() => {
			const blocks = [];
			const elements = [];

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

			return { elements, blocks };
		}, [innerBlocks]);
		const getAvailableBlockTypes = useCallback((availableBlocks) => {
			return Object.entries(availableBlocks).map(([, block]) => ({
				value: block.name,
				label: block.label,
			}));
		}, []);
		const {
			changeExtensionCurrentBlock: setCurrentBlock,
			setBlockClientInners,
		} = dispatch('blockera/extensions') || {};
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

		if (!Object.values(innerBlocks).length || isInnerBlock(currentBlock)) {
			return <></>;
		}

		const inners = getBlockInners(block.clientId);

		if (
			Object.keys(memoizedInnerBlocks).length !==
			Object.keys(inners).length
		) {
			setBlockClientInners({
				clientId: block.clientId,
				inners: mergeObject(inners, memoizedInnerBlocks),
			});
		}

		const contextValue = {
			block,
			value: memoizedInnerBlocks,
			blockName: block.blockName,
			attribute: 'blockeraInnerBlocks',
			name: generateExtensionId(block, 'inner-blocks', false),
		};

		const AvailableBlocksAndElements = () => {
			const CategorizedItems = ({
				items,
				title,
				category,
			}: Object): MixedElement => (
				<Flex
					direction={'column'}
					className={classNames('blockera-inner-blocks-inserter')}
				>
					<strong
						className={classNames('blockera-inner-block-category')}
					>
						{title}
					</strong>
					<Flex
						gap={'30px 5px'}
						flexWrap={'wrap'}
						justifyContent={'space-between'}
						className={`blockera-inner-block-types blockera-inner-${category}-wrapper`}
					>
						{items.map(
							(
								innerBlock: InnerBlockModel,
								index: number
							): MixedElement => {
								const { name, icon, label } = innerBlock;

								return (
									<div
										key={index}
										onClick={() => {
											setBlockClientInners({
												clientId: block.clientId,
												inners: {
													...getBlockInners(
														block.clientId
													),
													[name]: innerBlock,
												},
											});
											setCurrentBlock(name);
										}}
										aria-label={name}
										className={classNames(
											'blockera-inner-block-type'
										)}
									>
										<div
											className={classNames(
												'blockera-inner-block-icon'
											)}
										>
											{icon}
										</div>
										<div
											className={classNames(
												'blockera-inner-block-label'
											)}
										>
											{label}
										</div>
									</div>
								);
							}
						)}
					</Flex>
				</Flex>
			);

			return (
				<>
					<CategorizedItems
						category={'elements'}
						items={elements}
						title={__('Elements', 'blockera')}
					/>
					<CategorizedItems
						category={'blocks'}
						items={blocks}
						title={__('Blocks', 'blockera')}
					/>
				</>
			);
		};

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
							maxItems: Object.keys(innerBlocks).length,
							selectable: true,
							isSupportInserter: true,
							onDelete: (itemId) => {
								delete blockeraInnerBlocks[itemId];

								onChange(
									'blockeraInnerBlocks',
									blockeraInnerBlocks,
									{}
								);
							},
							onChange: (newValue: Object) => {
								const items = newValue?.value || {};

								for (const name in items) {
									const item = items[name];

									if (!item?.isSelected) {
										continue;
									}

									setCurrentBlock(item.name);
								}
							},
							InserterComponent: (props: Object) => {
								return (
									<Inserter
										AvailableBlocks={
											AvailableBlocksAndElements
										}
										{...props}
									/>
								);
							},
							repeaterItemHeader: ItemHeader,
							// repeaterItemOpener: ItemOpener,
							repeaterItemChildren: (props) => (
								<ItemBody
									{...{
										...props,
										options:
											getAvailableBlockTypes(innerBlocks),
										availableInnerBlocks: innerBlocks,
									}}
								/>
							),
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
	},
	hasSameProps
);
