// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { ControlContextProvider, RepeaterControl } from '@publisher/controls';
import { STORE_NAME } from '@publisher/controls/src/libs/repeater-control/store';
import { defaultItemValue } from '@publisher/controls/src/libs/repeater-control';
import { isEquals } from '@publisher/utils';

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
}: {
	states: Array<Object>,
	block: TBlockProps,
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

							if (newValue.length === states.length) {
								if (!isEquals(newValue, states)) {
									handleOnChangeAttributes(
										'publisherBlockStates',
										newValue,
										{
											addOrModifyRootItems: {
												publisherCurrentState:
													selectedState.type ||
													'normal',
											},
										}
									);
								}

								return;
							}

							handleOnChangeAttributes(
								'publisherBlockStates',
								newValue,
								{
									addOrModifyRootItems: {
										publisherCurrentState:
											selectedState.type || 'normal',
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
														state.type === item.type
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
