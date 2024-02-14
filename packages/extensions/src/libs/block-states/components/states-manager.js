// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
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
import type { BreakpointTypes, TStates } from '../types';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { PopoverTitleButtons } from './popover-title-buttons';
import { LabelDescription } from './label-description';
import StateContainer from '../../../components/state-container';
import { isInnerBlock } from '../../../components';
import { useBlockContext } from '../../../hooks';

const StatesManager: ComponentType<any> = ({
	block,
	states,
	onChange,
	rootStates,
	currentInnerBlockState,
	currentStateType,
}: {
	block: {
		...TBlockProps,
		attributes?: Object,
	},
	states: Array<Object>,
	currentInnerBlockState: TStates,
	currentStateType: TStates,
	rootStates: Array<Object>,
	onChange: THandleOnChangeAttributes,
}): Element<any> => {
	const { isNormalState } = useBlockContext();
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
		name: generateExtensionId(block, 'block-states', false),
	};

	const { currentBlock = 'master' } = useSelect((select) => {
		const { getExtensionCurrentBlock } = select(
			'publisher-core/extensions'
		);

		return {
			currentBlock: getExtensionCurrentBlock(),
		};
	});

	// const valueCleanup = (value: {
	// 	[key: TStates]: StateTypes,
	// }): Array<Object> => {
	// 	return Object.values(value)?.map((item: Object): Array<Object> => {
	// 		delete item.force;
	// 		// delete item.callback;
	// 		delete item.getBreakpoints;
	//
	// 		if (Object.values(value).length > 1) {
	// 			item.display = true;
	// 		}
	//
	// 		item?.breakpoints?.map((breakpoint) => {
	// 			delete breakpoint.force;
	// 			delete breakpoint.settings;
	//
	// 			return breakpoint;
	// 		});
	//
	// 		return item;
	// 	});
	// };

	return (
		<ControlContextProvider storeName={STORE_NAME} value={contextValue}>
			<StateContainer>
				<RepeaterControl
					{...{
						// valueCleanup,
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
						onChange: (newValue) =>
							onChangeBlockStates(newValue, {
								states,
								onChange,
								rootStates,
								currentBlock,
								isNormalState,
								currentInnerBlockState,
								currentStateType,
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
					addNewButtonLabel={__('Add New State', 'publisher-core')}
					label={
						'undefined' !== typeof currentBlock &&
						isInnerBlock(currentBlock)
							? __('Inner Block States', 'publisher-core')
							: __('Block States', 'publisher-core')
					}
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
};

export default StatesManager;
