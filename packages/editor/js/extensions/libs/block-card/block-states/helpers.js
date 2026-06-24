// @flow
/**
 * External dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import breakpoints from './default-breakpoints';
import type {
	TStates,
	StateTypes,
	TBreakpoint,
	BreakpointTypes,
} from './types';
import { isNormalState, isInnerBlock } from '../../../components/utils';
import { getBaseBreakpoint } from '../../../../editor/header-ui';

/**
 * Is normal state on base breakpoint?
 *
 * @param {TStates} stateType the current state type.
 * @param {TBreakpoint} breakpointType the current breakpoint type.
 *
 * @return {boolean} true on success, false on otherwise.
 */
export const isNormalStateOnBaseBreakpoint = (
	stateType: TStates,
	breakpointType: TBreakpoint
): boolean => {
	return isNormalState(stateType) && getBaseBreakpoint() === breakpointType;
};

export const getStateInfo = (
	state: TStates | number,
	states: { [key: string]: StateTypes }
): Object => {
	return 'number' === typeof state
		? Object.values(states)[state]
		: states[state];
};

export const getBreakpointInfo = (
	breakpoint: TBreakpoint
): BreakpointTypes | void => {
	return breakpoints()[breakpoint];
};

export function onChangeBlockStates(
	newValue: { [key: TStates]: { ...StateTypes, isSelected: boolean } },
	params: Object,
	states: { [key: string]: StateTypes }
): void {
	const onChangeValue: Object = { ...newValue };

	if (newValue.hasOwnProperty('modifyControlValue')) {
		newValue = onChangeValue?.value;
	}

	const {
		block,
		currentBlock,
		getStateInfo,
		getBlockStates,
		setCurrentBlock,
		isMasterBlockStates,
		currentBlockStyleVariation,
		skipExtensionSync = false,
	} = params;

	const { getSelectedBlock } = select('core/block-editor');
	const { name, clientId } = currentBlockStyleVariation?.name
		? {
				name: block?.blockName,
				clientId: block?.clientId,
			}
		: getSelectedBlock() || {
				name: block?.blockName,
				clientId: block?.clientId,
			};

	const { syncBlockStatesAfterDelete } =
		dispatch('blockera/extensions') || {};

	let selectedState: TStates | null = null;

	// $FlowFixMe
	for (const stateType: TStates in newValue) {
		const state = newValue[stateType];

		if (!isMasterBlockStates && state?.isSelected) {
			selectedState = stateType;
		} else if (state?.isSelected) {
			selectedState = stateType;

			const { getState, getInnerState } = select('blockera/editor');
			const {
				settings: { supportsInnerBlocks },
			} = getState(stateType) ||
				getInnerState(stateType) || {
					settings: { supportsInnerBlocks: true },
				};

			if (
				false === supportsInnerBlocks &&
				'function' === typeof setCurrentBlock
			) {
				setCurrentBlock('master');
			}
		} else if (Object.keys(newValue).length < 2 && newValue?.normal) {
			selectedState = 'normal';
		}
	}

	if (!skipExtensionSync) {
		syncBlockStatesAfterDelete({
			clientId,
			blockName: name,
			innerBlockType: isInnerBlock(currentBlock)
				? currentBlock
				: undefined,
			blockStates: newValue,
			blockType: !isMasterBlockStates ? currentBlock : name,
			currentState: selectedState || 'normal',
		});
	}

	if (onChangeValue.hasOwnProperty('modifyControlValue')) {
		let blockStates = {};
		const { modifyControlValue, controlId } = onChangeValue;

		blockStates = getBlockStates(
			clientId,
			!isMasterBlockStates ? currentBlock : name
		);

		const value: { [key: string]: Object } = {};

		for (const stateType in blockStates) {
			const stateItem = blockStates[stateType];
			const index = Object.keys(blockStates).indexOf(stateType);
			const info = getStateInfo(index, states);

			if (stateItem?.force) {
				info.deletable = false;
			}

			value[stateType] = {
				...info,
				...stateItem,
				isSelected: stateType === selectedState,
			};
		}

		modifyControlValue({
			controlId,
			value,
		});
	}
}

export const blockStatesValueCleanup = (value: {
	[key: TStates]: {
		...StateTypes,
		isVisible: boolean,
		'css-class'?: string,
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
			'css-class'?: string,
		},
	} = {};

	// $FlowFixMe
	for (const itemId: TStates in value) {
		const item = value[itemId];

		/**
		 * To compatible with deleted props of mergeObject api.
		 *
		 * @see ../helpers.js on line 179
		 */
		if (undefined === item) {
			clonedValue[itemId] = item;

			continue;
		}

		const breakpoints: {
			[key: TBreakpoint]: {
				attributes: Object,
			},
		} = {};

		// $FlowFixMe
		for (const breakpointType: TBreakpoint in item?.breakpoints) {
			const breakpoint = item?.breakpoints[breakpointType];

			if (!Object.keys(breakpoint?.attributes || {}).length) {
				continue;
			}

			const { attributes = {} } = breakpoint;

			if (!Object.keys(attributes).length) {
				continue;
			}

			breakpoints[breakpointType] = {
				attributes,
			};
		}

		const currentBreakpoint: TBreakpoint = select(
			'blockera/extensions'
		).getExtensionCurrentBlockStateBreakpoint();

		if (!Object.values(breakpoints).length) {
			breakpoints[currentBreakpoint] = {
				attributes: {},
			};
		}

		if (['custom-class', 'parent-class'].includes(itemId)) {
			clonedValue[itemId] = {
				breakpoints,
				isVisible: item?.isVisible,
				'css-class': item['css-class'] || '',
			};

			continue;
		}

		clonedValue[itemId] = {
			breakpoints,
			isVisible: item?.isVisible,
		};
	}

	return clonedValue;
};

export const isMasterBlockStates = (id: string): boolean =>
	'master-block-states' === id;
