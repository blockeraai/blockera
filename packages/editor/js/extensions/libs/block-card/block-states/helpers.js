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
import { getBaseBreakpoint } from '../../../../canvas-editor';
import { isNormalState } from '../../../components/utils';

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

	const { currentBlock, getStateInfo, getBlockStates, isMasterBlockStates } =
		params;
	const { getSelectedBlock } = select('core/block-editor');

	const {
		setBlockClientStates,
		setBlockClientInnerState,
		setBlockClientMasterState,
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('blockera/extensions') || {};

	let selectedState = null;

	// $FlowFixMe
	for (const stateType: TStates in newValue) {
		const state = newValue[stateType];
		const setInnerBlockDetails = () => {
			selectedState = stateType;
			setInnerBlockState(stateType);
			setBlockClientInnerState({
				currentState: stateType,
				innerBlockType: currentBlock,
				clientId: getSelectedBlock()?.clientId,
			});
		};
		const setBlockDetails = () => {
			selectedState = stateType;
			setCurrentState(stateType);
			setBlockClientMasterState({
				currentState: stateType,
				name: getSelectedBlock()?.name,
				clientId: getSelectedBlock()?.clientId,
			});
		};

		if (!isMasterBlockStates && state?.isSelected) {
			setInnerBlockDetails();
		} else if (state?.isSelected) {
			setBlockDetails();
		} else if (Object.keys(newValue).length < 2 && newValue?.normal) {
			if (!isMasterBlockStates) {
				setInnerBlockDetails();
			} else {
				setBlockDetails();
			}
		}
	}

	setBlockClientStates({
		clientId: getSelectedBlock()?.clientId,
		blockType: !isMasterBlockStates
			? currentBlock
			: getSelectedBlock()?.name,
		blockStates: newValue,
	});

	if (onChangeValue.hasOwnProperty('modifyControlValue')) {
		let blockStates = {};
		const { modifyControlValue, controlId } = onChangeValue;
		const { clientId, name } = getSelectedBlock();

		blockStates = getBlockStates(
			clientId,
			!isMasterBlockStates ? currentBlock : name
		);

		const value: { [key: string]: Object } = {};

		for (const stateType in blockStates) {
			const stateItem = blockStates[stateType];
			const index = Object.keys(blockStates).indexOf(stateType);
			const info = getStateInfo(index, states);

			if ('normal' === stateType) {
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

export const isDefaultState = (state: TStates): boolean =>
	['normal', 'hover'].includes(state);
