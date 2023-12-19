// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { ControlContextProvider, RepeaterControl } from '@publisher/controls';
import { STORE_NAME } from '@publisher/controls/src/libs/repeater-control/store';

/**
 * Internal dependencies
 */
import ItemBody from './item-body';
import ItemHeader from './item-header';
import ItemOpener from './item-opener';
import { getStateInfo } from '../helpers';
import { generateExtensionId } from '../../utils';
import getBreakpoints from '../default-breakpoints';
import { attributes as StateSettings } from '../attributes';
import type { BreakpointTypes, StateTypes, TStates } from '../types';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export default function StatesManager({
	block,
	states,
	handleOnChangeAttributes,
}: {
	states: Array<Object>,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): Element<any> {
	const contextValue = {
		block,
		value: states,
		hasSideEffect: true,
		attribute: 'publisherBlockStates',
		blockName: block.blockName,
		name: generateExtensionId(block, 'block-states'),
	};

	const valueCleanup = (value: Array<StateTypes>): Array<Object> => {
		return value?.map((item: Object): Array<Object> => {
			delete item.force;
			// delete item.callback;
			delete item.getBreakpoints;

			item?.breakpoints?.map((breakpoint) => {
				delete breakpoint.force;
				delete breakpoint.settings;

				return breakpoint;
			});

			return item;
		});
	};

	return (
		<>
			<div style={{ padding: '10px' }}>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={contextValue}
				>
					<RepeaterControl
						{...{
							withoutAdvancedLabel: true,
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
								visibilitySupport: true,
							},
							onChange: (newValue) => {
								if (newValue.length === states.length) {
									return;
								}

								const selectedState = newValue.find(
									(item) => item.isSelected
								);

								if (!selectedState) {
									return;
								}

								handleOnChangeAttributes(
									'publisherBlockStates',
									newValue,
									{
										addOrModifyRootItems: {
											publisherCurrentState:
												selectedState.type,
										},
									}
								);
							},
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
							onSelect: (event, item) => {
								handleOnChangeAttributes(
									'publisherCurrentState',
									item.type,
									{
										addOrModifyRootItems: {
											publisherBlockStates:
												block?.attributes?.publisherBlockStates.map(
													(
														state: StateTypes
													): {
														...StateTypes,
														isSelected: boolean,
													} => {
														if (
															state.type ===
															item.type
														) {
															return {
																...state,
																isSelected: true,
															};
														}

														return {
															...state,
															isSelected: false,
														};
													}
												),
										},
									}
								);

								return false;
							},
							repeaterItemHeader: ItemHeader,
							repeaterItemOpener: ItemOpener,
							repeaterItemChildren: ItemBody,
						}}
						label="Block States"
					/>
				</ControlContextProvider>
			</div>
		</>
	);
}
