// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, useSelect } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';
import { memo, useState, useEffect } from '@wordpress/element';

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
import { isEquals, mergeObject } from '@blockera/utils';

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
		// Internal selectors. to access current selected block and inner blocks stack of Blockera editor/extensions store api.
		const {
			stateUpdater,
			getBlockInners,
			selectedBlockHistory,
			currentBlock = 'master',
		} = useSelect((select) => {
			const {
				getBlockInners,
				getExtensionCurrentBlock,
				getSelectedInnerBlockHistory,
				getInnerBlocksExtensionStateUpdater,
			} = select('blockera/extensions');

			return {
				getBlockInners,
				selectedBlockHistory: getSelectedInnerBlockHistory(
					block.clientId
				),
				currentBlock: getExtensionCurrentBlock(),
				stateUpdater: getInnerBlocksExtensionStateUpdater,
			};
		});

		// Internal dispatchers. to use of "setCurrentBlock" and "setBlockClientInners" dispatchers of Blockera editor/extensions store api.
		const {
			setBlockClientInners,
			setSelectedInnerBlockHistory,
			updaterInnerBlocksExtensionState,
			changeExtensionCurrentBlock: setCurrentBlock,
		} = dispatch('blockera/extensions') || {};

		// Calculation: to prepare standard values for "blockeraInnerBlocks" block attribute with set initial value for repeater by "setBlockClientInners" dispatcher.
		const memoizedInnerBlocks = useMemoizedInnerBlocks({
			getBlockInners,
			setBlockClientInners,
			selectedBlockHistory,
			controlValue: values,
			clientId: block?.clientId,
			reservedInnerBlocks: innerBlocks,
		});

		// Calculation: to categorized in two category (elements and blocks) from available inner blocks on current WordPress selected block.
		const { elements, blocks } = useAvailableItems({
			getBlockInners,
			memoizedInnerBlocks,
			selectedBlockHistory,
			setBlockClientInners,
			clientId: block?.clientId,
			reservedInnerBlocks: innerBlocks,
		});

		// Merging all categories, as available blocks.
		const availableBlocks = [...elements, ...blocks];

		// Get repeater value from internal Blockera store api.
		const value = getBlockInners(block.clientId);

		const [blockInners, setBlockInners] = useState(value);

		// Set inner block extension state updater on mount this component.
		useEffect(() => {
			if ('function' !== typeof stateUpdater(block.clientId)) {
				updaterInnerBlocksExtensionState({
					setBlockInners,
					clientId: block.clientId,
				});
			}
			// eslint-disable-next-line
		}, []);

		useEffect(() => {
			if (!isEquals(value, blockInners)) {
				setBlockInners(value);
			}
			// eslint-disable-next-line
		}, [value]);

		// cache length to not calculate it multiple times.
		const innerBlocksLength = Object.keys(innerBlocks).length;

		if (
			!innerBlocksLength ||
			(!availableBlocks.length && !Object.keys(blockInners).length) ||
			isInnerBlock(currentBlock)
		) {
			return <></>;
		}

		// Assign control context provider value.
		const contextValue = {
			block,
			value: blockInners,
			blockName: block.blockName,
			attribute: 'blockeraInnerBlocks',
			name: generateExtensionId(block, 'inner-blocks', false),
		};

		// Calculation: repeater maxItems property.
		const maxItems = innerBlocksLength;

		return (
			<PanelBodyControl
				title={__('Inner Blocks', 'blockera')}
				initialOpen={Boolean(selectedBlockHistory)}
				icon={<Icon icon="extension-inner-blocks" />}
				className={extensionClassNames('inner-blocks')}
				onToggle={(isOpen) => {
					if (!isOpen) {
						setSelectedInnerBlockHistory({
							clientId: block.clientId,
							currentBlock: undefined,
						});
					}
				}}
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

										items[name] = {
											...item,
											isSelected: true,
										};

										setCurrentBlock(name);
										setSelectedInnerBlockHistory({
											currentBlock: name,
											clientId: block.clientId,
										});

										setBlockClientInners({
											clientId: block.clientId,
											inners: items,
										});
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
												setCurrentBlock={(
													selectedBlock: string
												) => {
													setCurrentBlock(
														selectedBlock
													);
													setSelectedInnerBlockHistory(
														{
															currentBlock:
																selectedBlock,
															clientId:
																block.clientId,
														}
													);
												}}
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
