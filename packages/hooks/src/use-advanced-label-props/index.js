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
import { isInnerBlock } from '@publisher/extensions/src/components/utils';
import { useBlockContext } from '@publisher/extensions/src/hooks/context';

/**
 * Internal dependencies
 */
import type {
	CalculatedAdvancedLabelProps,
	AdvancedLabelHookProps,
} from './types';
import { blockHasStates } from './helpers';
import type { TStates } from '@publisher/extensions/src/libs/block-states/types';

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
	// const debugKey = 'publisherFontSize';

	const {
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	} = useSelect((select) => {
		const {
			getExtensionCurrentBlock = () => 'master',
			getExtensionInnerBlockState = () => 'normal',
			getExtensionCurrentBlockState = () => 'normal',
			getExtensionCurrentBlockStateBreakpoint = () => 'laptop',
		} = select('publisher-core/extensions') || {};

		return {
			currentBlock: getExtensionCurrentBlock(),
			currentState: getExtensionCurrentBlockState(),
			currentInnerBlockState: getExtensionInnerBlockState(),
			currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
		};
	});

	// Get static publisherInnerBlocks value to use as fallback.
	const { publisherInnerBlocks, masterIsNormalState } = useBlockContext();
	let currentBlockAttributes = blockAttributes;

	if (isInnerBlock(currentBlock)) {
		// Assume current inner block inside master secondary state!
		if (!masterIsNormalState()) {
			currentBlockAttributes =
				(blockAttributes.publisherBlockStates[currentState]
					?.publisherInnerBlocks[currentBlock] &&
					blockAttributes.publisherBlockStates[currentState]
						?.publisherInnerBlocks[currentBlock].attributes) ||
				publisherInnerBlocks[currentBlock].attributes ||
				{};
		} else {
			currentBlockAttributes =
				(blockAttributes.publisherInnerBlocks[currentBlock] &&
					blockAttributes.publisherInnerBlocks[currentBlock]
						.attributes) ||
				publisherInnerBlocks[currentBlock].attributes ||
				{};
		}
	}

	// Excluding advanced label for specified rule.
	// Rule:
	// - If current block not has any changed attributes!
	// - Recieved attribute is equals with "publisherBlockStates".
	if (
		['', 'publisherBlockStates'].includes(attribute) ||
		!currentBlockAttributes ||
		!Object.values(currentBlockAttributes).length
	) {
		return {
			isChanged: false,
			isChangedOnNormal: false,
			isChangedOnOtherStates: false,
			isChangedOnCurrentState: false,
		};
	}

	// Assume block has not any states!
	if (!blockHasStates(currentBlockAttributes)) {
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
		currentBlockAttributes?.publisherBlockStates[
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
	}

	const isChangedOnOtherStates = Object.fromEntries(
		// $FlowFixMe
		Object.entries(currentBlockAttributes?.publisherBlockStates)?.filter(
			([stateType, state]: [TStates, Object]): boolean => {
				const breakpointTypes = Object.keys(state.breakpoints);

				return (
					Object.values(state.breakpoints).filter(
						(
							breakpoint: Object,
							breakpointIndex: number
						): boolean => {
							let stateValue =
								'normal' === stateType &&
								'laptop' === breakpointTypes[breakpointIndex]
									? currentBlockAttributes
									: breakpoint?.attributes;

							if (isEmpty(stateValue)) {
								return false;
							}

							// Assume control is repeater.
							if (isRepeater) {
								if (!isNormalState && 'normal' === stateType) {
									return (
										!isEmpty(stateValue[attribute]) &&
										!isUndefined(stateValue[attribute]) &&
										!isEquals(
											stateValue[attribute],
											defaultValue
										)
									);
								}

								return (
									!isEmpty(stateValue[attribute]) &&
									!isUndefined(stateValue[attribute]) &&
									!isEquals(
										stateValue[attribute],
										defaultValue
									)
								);
							}

							if (
								(path && isObject(stateValue)) ||
								isArray(stateValue)
							) {
								stateValue = prepare(path, stateValue);
							}

							if (!isNormalState && 'normal' === stateType) {
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
						}
					).length > 0
				);
			}
		)
	);

	let isChanged = !isEquals(defaultValue, value);

	if (!isNormalState) {
		if (stateValue) {
			isChanged = !isEquals(stateValue, value);
		}

		if (!isChanged && stateValue) {
			isChanged = !isEquals(stateValue, defaultValue);
		}
	}

	let isChangedOnNormal = isChangedOnOtherStates?.normal || false;

	if (isObject(isChangedOnNormal)) {
		isChangedOnNormal = true;
	}

	const isChangedOnCurrentState =
		isChangedOnOtherStates[
			isInnerBlock(currentBlock) ? currentInnerBlockState : currentState
		] || false;

	//TODO: Please commented after complete debug!
	// if (debugKey === attribute && !singularId) {
	// 	console.log({
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
		isChangedOnOtherStates: Object.keys(isChangedOnOtherStates).length > 0,
	};
};
