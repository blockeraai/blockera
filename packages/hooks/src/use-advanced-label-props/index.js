// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState, useEffect, useMemo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isEquals, isObject, isEmpty, isUndefined } from '@publisher/utils';
import { prepare } from '@publisher/data-extractor';
import {
	isInnerBlock,
	isNormalState as _isNormalBlockState,
} from '@publisher/extensions/src/components/utils';
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

export const useAdvancedLabelProps = (
	{
		path,
		value,
		//TODO: Please commented after complete debug!
		// singularId,
		attribute,
		isRepeater,
		defaultValue,
		isNormalState,
		blockAttributes,
	}: AdvancedLabelHookProps,
	delay: number
): CalculatedAdvancedLabelProps => {
	const [labelStatus, setLabelStatus] = useState({
		isChanged: false,
		isChangedOnNormal: false,
		isChangedOnOtherStates: false,
		isChangedOnCurrentState: false,
	});
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
	const { publisherInnerBlocks } = useBlockContext();
	const currentBlockAttributes = useMemo(() => {
		let calculatedAttributes = blockAttributes;

		if (isInnerBlock(currentBlock)) {
			// Assume current inner block inside master secondary state!
			if (!_isNormalBlockState(currentState)) {
				if (
					!blockAttributes.publisherBlockStates[currentState]
						.breakpoints[currentBreakpoint].attributes
						?.publisherInnerBlocks ||
					!blockAttributes.publisherBlockStates[currentState]
						.breakpoints[currentBreakpoint].attributes
						?.publisherInnerBlocks[currentBlock]
				) {
					calculatedAttributes =
						publisherInnerBlocks[currentBlock].attributes || {};
				} else {
					calculatedAttributes =
						blockAttributes.publisherBlockStates[currentState]
							.breakpoints[currentBreakpoint].attributes
							?.publisherInnerBlocks[currentBlock].attributes ||
						publisherInnerBlocks[currentBlock].attributes ||
						{};
				}
			} else {
				calculatedAttributes =
					(blockAttributes.publisherInnerBlocks[currentBlock] &&
						blockAttributes.publisherInnerBlocks[currentBlock]
							.attributes) ||
					publisherInnerBlocks[currentBlock].attributes ||
					{};
			}
		}

		return calculatedAttributes;
		// eslint-disable-next-line
	}, [blockAttributes]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			// Excluding advanced label for specified rule.
			// Rule:
			// - If current block not has any changed attributes!
			// - Recieved attribute is equals with "publisherBlockStates".
			if (
				['', 'publisherBlockStates'].includes(attribute) ||
				!currentBlockAttributes ||
				!Object.values(currentBlockAttributes).length
			) {
				return setLabelStatus({
					isChanged: false,
					isChangedOnNormal: false,
					isChangedOnOtherStates: false,
					isChangedOnCurrentState: false,
				});
			}

			// Assume block has not any states!
			if (!blockHasStates(currentBlockAttributes)) {
				const isChanged = !isEquals(defaultValue, value);

				return setLabelStatus({
					isChanged,
					isChangedOnNormal: isChanged,
					isChangedOnOtherStates: false,
					isChangedOnCurrentState: isChanged,
				});
			}
			const currentBlockState =
				currentBlockAttributes?.publisherBlockStates[
					!isInnerBlock(currentBlock)
						? currentState
						: currentInnerBlockState
				];
			const currentBreakpointType =
				currentBlockState?.breakpoints[currentBreakpoint];
			const stateAttributes = currentBreakpointType?.attributes;

			let stateValue = stateAttributes ? stateAttributes[attribute] : {};
			let clonedValue = value;
			let clonedDefaultValue = defaultValue;

			if (path && !isRepeater) {
				const _value = prepare(path, clonedValue);

				if (_value) {
					clonedValue = _value;
				}

				const _defaultValue = prepare(path, clonedDefaultValue);

				if (_defaultValue) {
					clonedDefaultValue = _defaultValue;
				}

				if (stateValue) {
					stateValue = prepare(path, stateValue);
				}
			}

			const isChangedOnOtherStates = Object.fromEntries(
				// $FlowFixMe
				Object.entries(
					currentBlockAttributes?.publisherBlockStates
				)?.filter(
					([stateType, state]: [
						TStates | string,
						Object
					]): boolean => {
						const breakpointTypes = Object.keys(state.breakpoints);

						return (
							Object.values(state.breakpoints).filter(
								(
									breakpoint: Object,
									breakpointIndex: number
								): boolean => {
									const stateValue =
										'normal' === stateType &&
										'laptop' ===
											breakpointTypes[breakpointIndex]
											? currentBlockAttributes
											: breakpoint?.attributes;

									if (isEmpty(stateValue)) {
										return false;
									}

									// Assume control is repeater.
									if (isRepeater) {
										if (
											!isNormalState &&
											'normal' === stateType
										) {
											return (
												!isEmpty(
													stateValue[attribute]
												) &&
												!isUndefined(
													stateValue[attribute]
												) &&
												!isEquals(
													stateValue[attribute],
													clonedDefaultValue
												)
											);
										}

										return (
											!isEmpty(stateValue[attribute]) &&
											!isUndefined(
												stateValue[attribute]
											) &&
											!isEquals(
												stateValue[attribute],
												clonedDefaultValue
											)
										);
									}

									if (
										!isNormalState &&
										'normal' === stateType
									) {
										return (
											!isEmpty(stateValue) &&
											!isUndefined(stateValue) &&
											!isEquals(
												stateValue,
												clonedDefaultValue
											)
										);
									}

									return (
										!isEmpty(stateValue) &&
										!isUndefined(stateValue) &&
										!isEquals(
											stateValue,
											clonedDefaultValue
										)
									);
								}
							).length > 0
						);
					}
				)
			);

			let isChanged = !isEquals(clonedDefaultValue, clonedValue);

			if (!isNormalState) {
				if (stateValue) {
					isChanged = !isEquals(stateValue, clonedValue);
				}

				if (!isChanged && stateValue) {
					isChanged = !isEquals(stateValue, clonedDefaultValue);
				}
			}

			let isChangedOnNormal = isChangedOnOtherStates?.normal || false;

			if (isObject(isChangedOnNormal)) {
				isChangedOnNormal = true;
			}

			const isChangedOnCurrentState =
				isChangedOnOtherStates[
					isInnerBlock(currentBlock)
						? currentInnerBlockState
						: currentState
				] || false;

			setLabelStatus({
				isChanged,
				isChangedOnNormal,
				isChangedOnCurrentState,
				isChangedOnOtherStates:
					Object.keys(isChangedOnOtherStates).length > 0,
			});
		}, delay);

		return () => clearTimeout(timeoutId);
	}, [
		value,
		attribute,
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	]);

	return labelStatus;
};
