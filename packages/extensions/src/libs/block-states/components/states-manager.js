// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
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
} from '../types';
import { useBlockContext } from '../../../hooks';
import { isInnerBlock } from '../../../components';
import { LabelDescription } from './label-description';
import { PopoverTitleButtons } from './popover-title-buttons';
import StateContainer from '../../../components/state-container';

const StatesManager: ComponentType<any> = memo(
	({ block, states, onChange }: StatesManagerProps): Element<any> => {
		const calculatedValue = useMemo(() => {
			const keys = Object.keys(states);
			return Object.values(states).length < 2
				? [
						{
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
				  ]
				: Object.values(states).map((state: Object, id: number) => {
						return {
							...state,
							...defaultStates[keys[id]],
							...defaultItemValue,
							isOpen: false,
							selectable: true,
							display: keys.length > 1,
							visibilitySupport: false,
							isSelected:
								'undefined' !== typeof state?.isSelected
									? state?.isSelected
									: 'normal' === keys[id],
							deletable: 'normal' !== keys[id],
							breakpoints: {
								...getBreakpoints(keys[id]),
								...(state?.breakpoints ?? {}),
							},
						};
				  });
		}, [states]);

		const valueCleanup = useCallback(
			(
				value: {
					[key: TStates]: StateTypes,
				},
				finalizeFlag: boolean = false
			): Array<Object> => {
				return Object.values(Object.assign({}, value))
					?.map((item: Object): Object | false => {
						const breakpoints = {};

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

								if (
									finalizeFlag &&
									!Object.keys(attributes).length &&
									'normal' !== item?.type
								) {
									return;
								}

								breakpoints[breakpoint.type] = { attributes };
							}
						);

						if (!Object.values(breakpoints).length) {
							return false;
						}

						return {
							breakpoints,
							isVisible: item?.isVisible,
						};
					})
					.filter((item) => 'object' === typeof item);
			},
			[]
		);

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
		const contextValue = {
			block,
			value: calculatedValue,
			hasSideEffect: true,
			onChange: (newValue) =>
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
			callback: (
				{ name: controlId, value: recievedValue }: ControlInfo,
				value: Array<{ ...StateTypes, isSelected: boolean }>,
				modifyControlValue: (params: Object) => void
			): void => {
				if (isEquals(value, recievedValue)) {
					return;
				}

				modifyControlValue({
					controlId,
					value: recievedValue.map((v) => {
						if (isInnerBlock(currentBlock)) {
							if (currentInnerBlockState === v.type) {
								return {
									...v,
									isSelected: true,
								};
							}
						} else if (currentState === v.type) {
							return {
								...v,
								isSelected: true,
							};
						}

						return {
							...v,
							isSelected: false,
						};
					}),
				});
			},
			blockName: block.blockName,
			attribute: 'publisherBlockStates',
			name: generateExtensionId(block, 'block-states', false),
		};

		return (
			<ControlContextProvider storeName={STORE_NAME} value={contextValue}>
				<StateContainer>
					<RepeaterControl
						{...{
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
