// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import {
	isEquals,
	isObject,
	isArray,
	isEmpty,
	isUndefined,
} from '@publisher/utils';
import { prepare } from '@publisher/data-extractor';

/**
 * Internal dependencies
 */
import type {
	CalculatedAdvancedLabelProps,
	AdvancedLabelHookProps,
} from './types';
import { isInnerBlock } from '@publisher/extensions/src/components/utils';
import { useBlockContext } from '@publisher/extensions/src/hooks/context';

export const useAdvancedLabelProps = ({
	path,
	value,
	//TODO: Please commented after complete debug!
	// singularId,
	attribute,
	isRepeater,
	defaultValue,
	isNormalState,
	blockAttributes,
}: AdvancedLabelHookProps): CalculatedAdvancedLabelProps => {
	//TODO: Please commented after complete debug!
	// const debugKey = 'publisherBorder';

	const {
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	} = useSelect((select) => {
		const {
			getExtensionCurrentBlock,
			getExtensionInnerBlockState,
			getExtensionCurrentBlockState,
			getExtensionCurrentBlockStateBreakpoint,
		} = select('publisher-core/extensions');

		return {
			currentBlock: getExtensionCurrentBlock(),
			currentState: getExtensionCurrentBlockState(),
			currentInnerBlockState: getExtensionInnerBlockState(),
			currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
		};
	});

	const { publisherInnerBlocks } = useBlockContext();

	if (
		['', 'publisherBlockStates'].includes(attribute) ||
		!blockAttributes ||
		!Object.values(blockAttributes).length
	) {
		return {
			isChanged: false,
			isChangedOnNormal: false,
			isChangedOnOtherStates: false,
			isChangedOnCurrentState: false,
		};
	}

	if (isInnerBlock(currentBlock)) {
		blockAttributes =
			blockAttributes?.publisherInnerBlocks[currentBlock] ||
			publisherInnerBlocks[currentBlock].attributes;
	}

	let _blockAttributes = blockAttributes[attribute];

	if (!blockAttributes?.publisherBlockStates) {
		const isChanged = !isEquals(defaultValue, value);
		const isChangedOnNormal = isChanged;
		const isChangedOnCurrentState = isChanged;

		return {
			isChanged,
			isChangedOnNormal,
			isChangedOnCurrentState,
			isChangedOnOtherStates: false,
		};
	}

	const currentBlockState =
		blockAttributes?.publisherBlockStates[
			!isInnerBlock(currentBlock) ? currentState : currentInnerBlockState
		];
	const currentBreakpointType =
		currentBlockState?.breakpoints[currentBreakpoint];
	const stateAttributes = currentBreakpointType?.attributes;

	let stateValue = stateAttributes ? stateAttributes[attribute] : {};

	if (path && !isRepeater) {
		const _value = prepare(path, value);

		if (_value) {
			value = _value;
		}

		const _defaultValue = prepare(path, defaultValue);

		if (_defaultValue) {
			defaultValue = _defaultValue;
		}

		if (stateValue) {
			stateValue = prepare(path, stateValue);
		}

		_blockAttributes = prepare(path, blockAttributes);
	}

	const isChangedOnOtherStates = Object.values(
		blockAttributes?.publisherBlockStates
	)?.filter((state: Object): boolean => {
		return (
			Object.values(state.breakpoints).filter((breakpoint) => {
				let stateValue =
					'normal' === state.type && 'laptop' === breakpoint.type
						? blockAttributes
						: breakpoint?.attributes;

				if (isEmpty(stateValue)) {
					return false;
				}

				// Assume control is repeater.
				if (isRepeater) {
					if (!isNormalState && 'normal' === state.type) {
						return (
							!isEmpty(stateValue[attribute]) &&
							!isUndefined(stateValue[attribute]) &&
							!isEquals(stateValue[attribute], defaultValue)
						);
					}

					return (
						!isEmpty(stateValue[attribute]) &&
						!isUndefined(stateValue[attribute]) &&
						!isEquals(stateValue[attribute], defaultValue)
					);
				}

				if ((path && isObject(stateValue)) || isArray(stateValue)) {
					stateValue = prepare(path, stateValue);
				}

				if (!isNormalState && 'normal' === state.type) {
					return (
						!isEmpty(stateValue) &&
						!isUndefined(stateValue) &&
						!isEquals(stateValue, defaultValue)
					);
				}

				return (
					!isEmpty(stateValue) &&
					!isUndefined(stateValue) &&
					!isEquals(stateValue, defaultValue)
				);
			}).length > 0
		);
	});

	let isChanged = !isEquals(defaultValue, value);

	if (!isNormalState) {
		if (stateValue) {
			isChanged = !isEquals(stateValue, value);
		}

		if (!isChanged && stateValue) {
			isChanged = !isEquals(stateValue, defaultValue);
		}
	}

	let isChangedOnNormal =
		isChangedOnOtherStates?.find(
			(state: Object): boolean => 'normal' === state.type
		) || false;

	if (isObject(isChangedOnNormal)) {
		isChangedOnNormal = true;
	}

	if (isEmpty(isChangedOnOtherStates) && !isChanged && _blockAttributes) {
		//FIXME: please double check all attributes default values and check controls valueCleanup()!!
		// FIXME: The below statement is very important because "isChangedOnNormal" var should not false when defaultValue of control and attribute of block is not equals!
		// isChangedOnNormal = !isEquals(_blockAttributes, defaultValue);
	}

	const isChangedOnCurrentState =
		isChangedOnOtherStates.filter(
			(item: Object): boolean => currentState === item.type
		).length > 0;

	//TODO: Please commented after complete debug!
	// if (debugKey === attribute && !singularId) {
	// 	console.table({
	// 		isChanged,
	// 		stateValue,
	// 		value,
	// 		defaultValue,
	// 		isChangedOnNormal,
	// 		isChangedOnOtherStates,
	// 		isChangedOnCurrentState,
	// 		path,
	// 	});
	// }

	return {
		isChanged,
		isChangedOnNormal,
		isChangedOnCurrentState,
		isChangedOnOtherStates:
			isChangedOnOtherStates.filter(
				(item: Object): boolean => 'normal' !== item.type
			).length > 0,
	};
};
