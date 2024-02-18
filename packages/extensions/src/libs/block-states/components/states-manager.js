// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import type { Element, ComponentType } from 'react';

/**
 * Publisher dependencies
 */
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
} from '../types';
import { PopoverTitleButtons } from './popover-title-buttons';
import { LabelDescription } from './label-description';
import StateContainer from '../../../components/state-container';
import { isInnerBlock } from '../../../components';
import { useBlockContext } from '../../../hooks';
import type { ControlInfo } from '@publisher/controls/src/context/types';
import { isEquals, omit } from '@publisher/utils';

const StatesManager: ComponentType<any> = memo(
	({ block, states, onChange }: StatesManagerProps): Element<any> => {
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
		const keys = Object.keys(states);
		const contextValue = {
			block,
			value: !Object.values(states).length
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
							deletable: false,
							selectable: true,
							display: keys.length > 1,
							visibilitySupport: false,
							isSelected: 'normal' === keys[id],
							breakpoints: {
								...getBreakpoints(keys[id]),
								...(state?.breakpoints ?? {}),
							},
						};
				  }),
			hasSideEffect: true,
			callback: (
				{ name: controlId, value: recievedValue }: ControlInfo,
				value: Array<{ ...StateTypes, isSelected: boolean }>,
				modifyControlValue: (params: Object) => void
			): void => {
				let target = value;

				const selectedState = Object.values(target).find(
					(state: { ...StateTypes, isSelected: boolean }): boolean =>
						state.isSelected
				);

				if (
					(!selectedState ||
						currentState === selectedState.type ||
						(isInnerBlock(currentBlock) &&
							currentInnerBlockState === selectedState.type)) &&
					recievedValue.length !== value.length &&
					'normal' === selectedState?.type
				) {
					target = recievedValue;

					const _value = target.map((item) => {
						if (isInnerBlock(currentBlock)) {
							if (currentInnerBlockState === item.type) {
								return {
									...item,
									isSelected: true,
								};
							}
						} else if (currentState === item.type) {
							return {
								...item,
								isSelected: true,
							};
						}

						return item;
					});

					modifyControlValue({
						controlId,
						value: _value,
					});

					return;
				}

				if (
					!selectedState ||
					currentState === selectedState.type ||
					(isInnerBlock(currentBlock) &&
						currentInnerBlockState === selectedState.type)
				) {
					return;
				}

				const selectedIndex = target.indexOf(selectedState);

				const _value = target.map((v, i) => {
					if (i === selectedIndex) {
						return {
							...v,
							isSelected: false,
						};
					}

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

					return v;
				});

				modifyControlValue({
					controlId,
					value: _value,
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
							onChange: (newValue) =>
								onChangeBlockStates(newValue, {
									states,
									onChange,
									currentState,
									currentBlock,
									isNormalState,
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
