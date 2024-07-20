// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { __ } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';
import type { Element, ComponentType, MixedElement } from 'react';
import { memo, useMemo, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals, isEmpty, omit, mergeObject } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import {
	RepeaterControl,
	PromotionPopover,
	defaultItemValue,
	ControlContextProvider,
	getRepeaterActiveItemsCount,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import ItemBody from './item-body';
import defaultStates from '../states';
import ItemHeader from './item-header';
import ItemOpener from './item-opener';
import {
	getStateInfo,
	onChangeBlockStates,
	blockStatesValueCleanup,
} from '../helpers';
import { generateExtensionId } from '../../utils';
import { attributes as StateSettings } from '../attributes';
import type {
	BreakpointTypes,
	StatesManagerProps,
	StateTypes,
	TStates,
} from '../types';
import { isInnerBlock } from '../../../components';
import { LabelDescription } from './label-description';
import { PopoverTitleButtons } from './popover-title-buttons';
import { getBaseBreakpoint } from '../../../../canvas-editor';
import StateContainer from '../../../components/state-container';

const StatesManager: ComponentType<any> = memo(
	({
		block,
		attributes,
		onChange,
		currentBlock,
		currentState,
		availableStates,
		currentBreakpoint,
		currentInnerBlockState,
	}: StatesManagerProps): Element<any> => {
		let states = { ...(attributes?.blockeraBlockStates || {}) };
		const {
			changeExtensionCurrentBlockState: setCurrentState,
			changeExtensionInnerBlockState: setInnerBlockState,
		} = dispatch('blockera/extensions') || {};
		const { getBlockStates, getActiveMasterState, getActiveInnerState } =
			select('blockera/extensions');
		const { getBreakpoints } = select('blockera/editor');
		const savedBlockStates = getBlockStates(
			block?.clientId,
			isInnerBlock(currentBlock) ? currentBlock : block?.blockName
		);
		const clonedSavedStates = { ...states };

		if (isEmpty(states)) {
			// Sets initialize states ...
			states = savedBlockStates;
		} else {
			states = mergeObject(savedBlockStates, states);
		}

		const preparedStates = !availableStates
			? defaultStates
			: availableStates;

		const calculatedValue = useMemo(() => {
			const itemsCount = Object.values(states).length;
			if (itemsCount >= 2) {
				const initialValue: { [key: TStates | string]: StateTypes } =
					{};

				const memoizedInitialValue = memoize(
					([itemId, state]: [
						TStates,
						{ ...StateTypes, isSelected: boolean }
					]): void => {
						const activeInnerBlockState = getActiveInnerState(
							block.clientId,
							currentBlock
						);
						const activeMasterBlockState = getActiveMasterState(
							block.clientId,
							block.blockName
						);
						const isSelected = isInnerBlock(currentBlock)
							? itemId === activeInnerBlockState
							: itemId === activeMasterBlockState;

						// Assume block-state for inner blocks and itemId equals with store active state.
						if (
							isInnerBlock(currentBlock) &&
							itemId === activeInnerBlockState
						) {
							setInnerBlockState(itemId);
						}
						// Assume block-state for master block and itemId equals with store active state.
						else if (itemId === activeMasterBlockState) {
							setCurrentState(itemId);
						}

						initialValue[itemId] = {
							...state,
							...preparedStates[itemId],
							...defaultItemValue,
							isOpen: false,
							selectable: true,
							display: itemsCount > 1,
							visibilitySupport: false,
							isSelected,
							deletable: 'normal' !== itemId,
							breakpoints: state?.breakpoints ?? {
								// $FlowFixMe
								[getBaseBreakpoint()]: {
									attributes: {},
								},
							},
						};
					}
				);

				Object.entries(states).forEach(memoizedInitialValue);

				return initialValue;
			}

			if (!isInnerBlock(currentBlock)) {
				setCurrentState('normal');
			} else {
				setInnerBlockState('normal');
			}

			return {
				normal: {
					...preparedStates.normal,
					...defaultItemValue,
					isOpen: false,
					display: false,
					deletable: false,
					selectable: true,
					isSelected: true,
					visibilitySupport: false,
					breakpoints: states.normal.breakpoints,
				},
			};
			// eslint-disable-next-line
		}, [currentBlock, states, currentBreakpoint]);

		const valueCleanup = useCallback(
			blockStatesValueCleanup,
			// eslint-disable-next-line
			[]
		);

		const onDelete = (
			itemId: TStates,
			items: {
				[key: TStates]: Object,
			}
		): Object => {
			const filteredStates: {
				[key: TStates]: Object,
			} = {};
			const itemsCount = Object.keys(items).length;

			Object.entries(items).forEach(
				([_itemId, _item]: [
					TStates,
					{ ...StateTypes, isSelected: boolean }
				]): void => {
					if (_itemId === itemId) {
						return;
					}

					if (itemsCount < 3) {
						filteredStates[_itemId] = {
							..._item,
							display: false,
						};

						return;
					}

					if ('normal' === _itemId) {
						if (items[itemId].isSelected) {
							// Assume deleted item was selected item
							filteredStates[_itemId] = {
								..._item,
								isSelected: true,
							};

							return;
						}

						filteredStates[_itemId] = {
							..._item,
						};

						return;
					}

					filteredStates[_itemId] = _item;
				}
			);

			let isDeletedItem: boolean = false;

			// $FlowFixMe
			for (const stateType: TStates in clonedSavedStates) {
				if (!filteredStates[stateType]) {
					isDeletedItem = true;
					delete clonedSavedStates[stateType];
				}
			}

			if (isDeletedItem) {
				// Remove base breakpoint of normal state.
				delete clonedSavedStates?.normal?.breakpoints[
					getBaseBreakpoint()
				];

				// Remove normal state while not exists any breakpoints.
				if (
					!Object.keys(clonedSavedStates?.normal?.breakpoints || {})
						.length
				) {
					delete clonedSavedStates?.normal;
				}

				onChange(
					'blockeraBlockStates',
					!Object.keys(clonedSavedStates).length
						? {}
						: clonedSavedStates,
					{}
				);
			}

			return filteredStates;
		};

		const defaultRepeaterItemValue = {
			...StateSettings.blockeraBlockStates.default[0],
			deletable: true,
			selectable: true,
			visibilitySupport: true,
		};

		const contextValue = {
			block,
			value: calculatedValue,
			blockName: block.blockName,
			attribute: 'blockeraBlockStates',
			name: generateExtensionId(block, 'block-states', false),
		};

		return (
			<ControlContextProvider
				value={contextValue}
				storeName={'blockera/controls/repeater'}
			>
				<StateContainer>
					<RepeaterControl
						{...{
							onDelete,
							id: 'block-states',
							maxItems: Object.keys(preparedStates).length,
							valueCleanup: (value) => value,
							selectable: true,
							/**
							 * Retrieve dynamic default value for repeater items.
							 *
							 * @param {number} statesCount the states counter.
							 * @param {Object} defaultRepeaterItemValue the state item default value.
							 * @return {{settings: {max: number, min: number, color: string, cssSelector?: string}, force: boolean, label: string, breakpoints: Array<Object>, type: TStates}} the
							 * state item with dynamic default value.
							 */
							getDynamicDefaultRepeaterItem: (
								statesCount: number,
								defaultRepeaterItemValue: Object
							): Object => {
								let defaultItem = {
									...defaultRepeaterItemValue,
									...getStateInfo(statesCount),
									display: true,
								};

								// Recalculate states count if deleted state re added.
								if (
									Object.keys(calculatedValue).indexOf(
										defaultItem.type
									) !== -1
								) {
									const newStatesCount = Object.values(
										preparedStates
									).findIndex(
										(item) =>
											!Object.keys(
												calculatedValue
											).includes(item.type)
									);

									defaultItem = {
										...defaultItem,
										...getStateInfo(newStatesCount),
									};
								}

								if (
									['custom-class', 'parent-class'].includes(
										defaultItem.type
									)
								) {
									defaultItem['css-class'] = '';
								}

								defaultItem.breakpoints = getBreakpoints(
									defaultItem.type
								);

								return defaultItem;
							},
							defaultRepeaterItemValue,
							onChange: (newValue: Object) =>
								onChangeBlockStates(newValue, {
									states,
									onChange,
									currentState,
									currentBlock,
									valueCleanup,
									getStateInfo,
									getBlockStates,
									currentInnerBlockState,
								}),
							//Override item when occurred clone action!
							overrideItem: (item) => {
								if ('normal' === item.type) {
									return {
										deletable: true,
										visibilitySupport: true,
										breakpoints: item?.breakpoints?.map(
											(
												b: BreakpointTypes
											): BreakpointTypes => {
												if (
													getBaseBreakpoint() ===
													b.type
												) {
													return {
														...b,
														attributes: {},
													};
												}

												return b;
											}
										),
									};
								}

								return {};
							},
							repeaterItemHeader: ItemHeader,
							repeaterItemOpener: ItemOpener,
							repeaterItemChildren: ItemBody,
						}}
						defaultValue={states}
						addNewButtonLabel={__('Add New State', 'blockera')}
						label={
							'undefined' !== typeof currentBlock &&
							isInnerBlock(currentBlock)
								? __('Inner Block States', 'blockera')
								: __('Block States', 'blockera')
						}
						labelDescription={<LabelDescription />}
						popoverTitle={__('Block State', 'blockera')}
						className={controlInnerClassNames(
							'block-states-repeater'
						)}
						itemColumns={2}
						actionButtonClone={false}
						actionButtonVisibility={false}
						popoverTitleButtonsRight={PopoverTitleButtons}
						PromoComponent={({
							items,
							onClose = () => {},
							isOpen = false,
						}): MixedElement | null => {
							if (getRepeaterActiveItemsCount(items) < 2) {
								return null;
							}

							return (
								<PromotionPopover
									heading={__(
										'Advanced Block States',
										'blockera'
									)}
									featuresList={[
										__('Multiple states', 'blockera'),
										__('All block states', 'blockera'),
										__('Advanced features', 'blockera'),
										__('Premium blocks', 'blockera'),
									]}
									isOpen={isOpen}
									onClose={onClose}
								/>
							);
						}}
					/>
				</StateContainer>
			</ControlContextProvider>
		);
	},
	(prev, next) => {
		return isEquals(omit(prev, ['onChange']), omit(next, ['onChange']));
	}
);

export default StatesManager;
