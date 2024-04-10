// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { __ } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';
import type { Element, ComponentType } from 'react';
import { memo, useMemo, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals, omit } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import { ControlContextProvider, RepeaterControl } from '@blockera/controls';
import { STORE_NAME } from '@blockera/controls/src/libs/repeater-control/store';
import { defaultItemValue } from '@blockera/controls/src/libs/repeater-control';

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
import getBreakpoints from '../default-breakpoints';
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
import StateContainer from '../../../components/state-container';

const StatesManager: ComponentType<any> = memo(
	({
		block,
		states,
		onChange,
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	}: StatesManagerProps): Element<any> => {
		const {
			changeExtensionCurrentBlockState: setCurrentState,
			changeExtensionInnerBlockState: setInnerBlockState,
		} = dispatch('blockera-core/extensions') || {};
		const { getActiveMasterState, getActiveInnerState } = select(
			'blockera-core/extensions'
		);

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
							...defaultStates[itemId],
							...defaultItemValue,
							isOpen: false,
							selectable: true,
							display: itemsCount > 1,
							visibilitySupport: false,
							isSelected,
							deletable: 'normal' !== itemId,
							breakpoints: state?.breakpoints ?? {
								laptop: {
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
					...defaultStates.normal,
					...defaultItemValue,
					isOpen: false,
					display: false,
					deletable: false,
					selectable: true,
					isSelected: true,
					visibilitySupport: false,
					breakpoints:
						StateSettings.blockeraBlockStates.default.normal
							.breakpoints,
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
							isSelected: true,
						};

						return;
					}

					if ('normal' === _itemId) {
						filteredStates[_itemId] = {
							..._item,
							isSelected: true,
						};

						return;
					}

					filteredStates[_itemId] = _item;
				}
			);

			return filteredStates;
		};

		const contextValue = {
			block,
			value: calculatedValue,
			blockName: block.blockName,
			attribute: 'blockeraBlockStates',
			name: generateExtensionId(block, 'block-states', false),
		};

		return (
			<ControlContextProvider storeName={STORE_NAME} value={contextValue}>
				<StateContainer>
					<RepeaterControl
						{...{
							onDelete,
							maxItems: 10,
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
								const defaultItem = {
									...defaultRepeaterItemValue,
									...getStateInfo(statesCount),
									display: true,
								};

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
							defaultRepeaterItemValue: {
								...StateSettings.blockeraBlockStates.default[0],
								deletable: true,
								selectable: true,
								visibilitySupport: true,
							},
							onChange: (newValue: Object) =>
								onChangeBlockStates(newValue, {
									states,
									onChange,
									currentState,
									currentBlock,
									valueCleanup,
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
												if ('desktop' === b.type) {
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
						addNewButtonLabel={__('Add New State', 'blockera-core')}
						label={
							'undefined' !== typeof currentBlock &&
							isInnerBlock(currentBlock)
								? __('Inner Block States', 'blockera-core')
								: __('Block States', 'blockera-core')
						}
						labelDescription={<LabelDescription />}
						popoverTitle={__('Block State', 'blockera-core')}
						className={controlInnerClassNames(
							'block-states-repeater'
						)}
						itemColumns={2}
						actionButtonClone={false}
						actionButtonVisibility={false}
						popoverTitleButtonsRight={PopoverTitleButtons}
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
