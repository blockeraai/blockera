// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import type { Element, ComponentType } from 'react';
import { memo, useMemo, useCallback } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isEquals, omit } from '@publisher/utils';
import { controlInnerClassNames } from '@publisher/classnames';
import { ControlContextProvider, RepeaterControl } from '@publisher/controls';
import { STORE_NAME } from '@publisher/controls/src/libs/repeater-control/store';
import { defaultItemValue } from '@publisher/controls/src/libs/repeater-control';

/**
 * Internal dependencies
 */
import ItemBody from './item-body';
import defaultStates from '../states';
import ItemHeader from './item-header';
import ItemOpener from './item-opener';
import { getStateInfo, onChangeBlockStates } from '../helpers';
import { generateExtensionId } from '../../utils';
import getBreakpoints from '../default-breakpoints';
import { attributes as StateSettings } from '../attributes';
import type {
	BreakpointTypes,
	StatesManagerProps,
	StateTypes,
	TStates,
	TBreakpoint,
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
		} = dispatch('publisher-core/extensions') || {};

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
						if (state?.isSelected) {
							if (isInnerBlock(currentBlock)) {
								setInnerBlockState(itemId);
							} else {
								setCurrentState(itemId);
							}
						}

						initialValue[itemId] = {
							...state,
							...defaultStates[itemId],
							...defaultItemValue,
							isOpen: false,
							selectable: true,
							display: itemsCount > 1,
							visibilitySupport: false,
							isSelected:
								'undefined' !== typeof state?.isSelected
									? state?.isSelected
									: 'normal' === itemId,
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
					breakpoints: states.normal.breakpoints,
				},
			};
			// eslint-disable-next-line
		}, [currentBlock, states, currentBreakpoint]);

		const valueCleanup = useCallback(
			(value: {
				[key: TStates]: {
					...StateTypes,
					isVisible: boolean,
					'css-class'?: string,
					isSelected: boolean,
				},
			}): Object => {
				const clonedValue: {
					[key: TStates]: {
						breakpoints: {
							[key: TBreakpoint]: {
								attributes: Object,
							},
						},
						isVisible: boolean,
						isSelected: boolean,
						'css-class'?: string,
					},
				} = {};

				Object.entries(value).forEach(
					([itemId, item]: [
						TStates,
						{
							...StateTypes,
							isSelected: boolean,
							isVisible: boolean,
							'css-class'?: string,
						}
					]): void => {
						const breakpoints: {
							[key: TBreakpoint]: {
								attributes: Object,
							},
						} = {};

						Object.entries(item?.breakpoints)?.forEach(
							([breakpointType, breakpoint]: [
								TBreakpoint,
								Object
							]) => {
								if (
									!Object.keys(breakpoint?.attributes || {})
										.length &&
									'laptop' !== breakpointType
								) {
									return;
								}

								const { attributes = {} } = breakpoint;

								if (
									!Object.keys(attributes).length &&
									'normal' !== itemId
								) {
									return;
								}

								breakpoints[breakpointType] = {
									attributes,
								};
							}
						);

						if (
							!Object.values(breakpoints).length &&
							'normal' !== itemId
						) {
							breakpoints[currentBreakpoint] = {
								attributes: {},
							};
						}

						if (['custom-class', 'parent-class'].includes(itemId)) {
							clonedValue[itemId] = {
								breakpoints,
								isVisible: item?.isVisible,
								isSelected: item?.isSelected,
								'css-class': item['css-class'] || '',
							};

							return;
						}

						clonedValue[itemId] = {
							breakpoints,
							isVisible: item?.isVisible,
							isSelected: item?.isSelected,
						};
					}
				);

				return clonedValue;
			},
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

					if ('normal' === _itemId) {
						filteredStates[_itemId] = {
							..._item,
							isSelected: true,
						};

						return;
					}

					if (itemsCount < 2) {
						filteredStates[_itemId] = {
							..._item,
							display: false,
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
			attribute: 'publisherBlockStates',
			name: generateExtensionId(block, 'block-states', false),
		};

		return (
			<ControlContextProvider storeName={STORE_NAME} value={contextValue}>
				<StateContainer>
					<RepeaterControl
						{...{
							onDelete,
							maxItems: 10,
							valueCleanup,
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
								getBreakpoints,
								callback: getStateInfo,
								...StateSettings.publisherBlockStates
									.default[0],
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
						addNewButtonLabel={__(
							'Add New State',
							'publisher-core'
						)}
						label={
							'undefined' !== typeof currentBlock &&
							isInnerBlock(currentBlock)
								? __('Inner Block States', 'publisher-core')
								: __('Block States', 'publisher-core')
						}
						labelDescription={<LabelDescription />}
						popoverTitle={__('Block State', 'publisher-core')}
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
