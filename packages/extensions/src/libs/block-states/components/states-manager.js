// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { isEquals } from '@publisher/utils';
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
import { getStateInfo } from '../helpers';
import { generateExtensionId } from '../../utils';
import getBreakpoints from '../default-breakpoints';
import { attributes as StateSettings } from '../attributes';
import type { BreakpointTypes, StateTypes, TStates } from '../types';
import type { TBlockProps } from '../../types';
import { PopoverTitleButtons } from './popover-title-buttons';
import { LabelDescription } from './label-description';
import { useBlockContext } from '../../../hooks';
import StateContainer from '../../../components/state-container';

export default function StatesManager({
	block,
	states,
	setParentIsLoad,
}: {
	states: Array<Object>,
	block: TBlockProps,
	setParentIsLoad: (isLoad: boolean) => void,
}): Element<any> {
	const { handleOnChangeAttributes } = useBlockContext();

	const contextValue = {
		block,
		value: !states.length
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
			: states,
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

			if (value.length > 1) {
				item.display = true;
			}

			item?.breakpoints?.map((breakpoint) => {
				delete breakpoint.force;
				delete breakpoint.settings;

				return breakpoint;
			});

			return item;
		});
	};

	const currentState = getStateInfo(block.attributes.publisherCurrentState);

	return (
		<ControlContextProvider storeName={STORE_NAME} value={contextValue}>
			<StateContainer currentState={currentState}>
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
							...StateSettings.publisherBlockStates.default[0],
							deletable: true,
							selectable: true,
							visibilitySupport: true,
						},
						onChange: (newValue) => {
							const selectedState = newValue.find(
								(item) => item.isSelected
							);

							if (!selectedState) {
								return;
							}

							const isEqualsWithCurrentState = (type: TStates) =>
								type === block.attributes.publisherCurrentState;

							if (
								isEqualsWithCurrentState(selectedState.type) &&
								states.length
							) {
								return;
							}

							if (newValue.length !== states.length) {
								const addOrModifyRootItems =
									isEqualsWithCurrentState(selectedState.type)
										? {}
										: {
												publisherCurrentState:
													selectedState.type ||
													'normal',
										  };
								const blockStates =
									block.attributes.publisherBlockStates;

								setParentIsLoad(false);

								handleOnChangeAttributes(
									'publisherBlockStates',
									newValue.map((state, index) => {
										if (
											blockStates[index] &&
											blockStates[index].isSelected
										) {
											return {
												...blockStates[index],
												isOpen: false,
												isSelected: false,
											};
										}
										if (blockStates[index]) {
											return {
												...blockStates[index],
												isOpen: false,
											};
										}

										return state;
									}),
									{
										addOrModifyRootItems,
									}
								);

								return;
							}

							if (
								!isEquals(
									selectedState.type,
									block.attributes.publisherCurrentState
								)
							) {
								handleOnChangeAttributes(
									'publisherCurrentState',
									selectedState.type,
									{
										addOrModifyRootItems: {
											publisherBlockStates:
												block.attributes.publisherBlockStates.map(
													(
														state: Object,
														stateId: number
													): Object => {
														if (
															stateId ===
															newValue.indexOf(
																selectedState
															)
														) {
															return {
																...state,
																isOpen: false,
																isSelected: true,
																type: selectedState.type,
																label: selectedState.label,
															};
														}

														return {
															...state,
															isOpen: false,
															isSelected: false,
														};
													}
												),
										},
									}
								);
							} else {
								setParentIsLoad(false);

								handleOnChangeAttributes(
									'publisherCurrentState',
									selectedState.type || 'normal'
								);
							}
						},
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
					addNewButtonLabel={__('Add New State', 'publisher-core')}
					label={__('Block States', 'publisher-core')}
					labelDescription={<LabelDescription />}
					popoverTitle={__('Block State', 'publisher-core')}
					className={controlInnerClassNames('block-states-repeater')}
					itemColumns={2}
					actionButtonClone={false}
					actionButtonVisibility={false}
					popoverTitleButtonsRight={PopoverTitleButtons}
				/>
			</StateContainer>
		</ControlContextProvider>
	);
}
