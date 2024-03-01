// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { __ } from '@wordpress/i18n';
import { dispatch, useSelect } from '@wordpress/data';
import type { Element, ComponentType } from 'react';
import { memo, useMemo, useCallback } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isEquals, omit } from '@publisher/utils';
import { controlInnerClassNames } from '@publisher/classnames';
import type { ControlInfo } from '@publisher/controls/src/context/types';
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
import { useBlockContext } from '../../../hooks';
import { isInnerBlock } from '../../../components';
import { LabelDescription } from './label-description';
import { PopoverTitleButtons } from './popover-title-buttons';
import StateContainer from '../../../components/state-container';

const StatesManager: ComponentType<any> = memo(
	({ block, states, onChange }: StatesManagerProps): Element<any> => {
		const {
			changeExtensionCurrentBlockState: setCurrentState,
			changeExtensionInnerBlockState: setInnerBlockState,
		} = dispatch('publisher-core/extensions') || {};

		const { isNormalState } = useBlockContext();

		const { currentBlock, currentState, currentInnerBlockState } =
			useSelect((select) => {
				const {
					getExtensionCurrentBlock,
					getExtensionInnerBlockState,
					getExtensionCurrentBlockState,
				} = select('publisher-core/extensions');

				return {
					currentBlock: getExtensionCurrentBlock(),
					currentState: getExtensionCurrentBlockState(),
					currentInnerBlockState: getExtensionInnerBlockState(),
				};
			});

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
								setInnerBlockState(state.type);
							} else {
								setCurrentState(state.type);
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
							breakpoints: {
								...getBreakpoints(itemId),
								...(state?.breakpoints ?? {}),
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
					breakpoints: getBreakpoints('normal'),
				},
			};
			// eslint-disable-next-line
		}, [currentBlock, states]);

		const memoizedCallback = useCallback(
			(
				{ name: controlId, value: recievedValue }: ControlInfo,
				value: Array<{ ...StateTypes, isSelected: boolean }>,
				modifyControlValue: (params: Object) => void
			): void => {
				if (isEquals(value, recievedValue)) {
					return;
				}

				const clonedRecievedValue: {
					[key: TStates | string]: {
						...StateTypes,
						isSelected: boolean,
					},
				} = {};

				Object.entries(recievedValue).forEach(
					([itemId, state]: [
						TStates | string,
						{ ...StateTypes, isSelected: boolean }
					]): void => {
						if (isInnerBlock(currentBlock)) {
							if (currentInnerBlockState === state.type) {
								clonedRecievedValue[itemId] = {
									...state,
									isSelected: true,
								};

								return;
							}
						} else if (currentState === state.type) {
							clonedRecievedValue[itemId] = {
								...state,
								isSelected: true,
							};

							return;
						}

						clonedRecievedValue[itemId] = {
							...state,
							isSelected: false,
						};
					}
				);

				modifyControlValue({
					controlId,
					value: clonedRecievedValue,
				});
			},
			// eslint-disable-next-line
			[states]
		);

		const valueCleanup = useCallback(
			(
				value: {
					[key: TStates]: { ...StateTypes, isVisible: boolean },
				},
				finalizeFlag: boolean = false
			): Object => {
				const clonedValue: {
					[key: TStates | string]: {
						breakpoints: {
							[key: TBreakpoint]: {
								attributes: Object,
							},
						},
						isVisible: boolean,
						'css-class'?: string,
					},
				} = {};

				Object.entries(value).forEach(
					([itemId, item]: [string | TStates, Object]): void => {
						const breakpoints: {
							[key: TBreakpoint]: {
								attributes: Object,
							},
						} = {};

						Object.values(item?.breakpoints)?.forEach(
							(breakpoint) => {
								if (
									!Object.keys(breakpoint?.attributes || {})
										.length &&
									'laptop' !== breakpoint?.type
								) {
									return;
								}

								const { attributes = {} } = breakpoint;

								// TODO: remove finalizeFlag!
								if (
									finalizeFlag &&
									!Object.keys(attributes).length &&
									'normal' !== item?.type
								) {
									return;
								}

								breakpoints[breakpoint.type] = {
									attributes,
								};
							}
						);

						if (!Object.values(breakpoints).length) {
							return;
						}

						if (['custom-class', 'parent-class'].includes(itemId)) {
							clonedValue[itemId] = {
								breakpoints,
								'css-class': item['css-class'] || '',
								isVisible: item?.isVisible,
							};

							return;
						}

						clonedValue[itemId] = {
							breakpoints,
							isVisible: item?.isVisible,
						};
					}
				);

				return clonedValue;
			},
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
			hasSideEffect: true,
			onChange: (newValue: Object) =>
				onChangeBlockStates(newValue, {
					states,
					onChange,
					currentState,
					currentBlock,
					isNormalState,
					calculatedValue,
					currentInnerBlockState,
				}),
			valueCleanup,
			callback: memoizedCallback,
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
							onChange: contextValue.onChange,
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
