// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState, useEffect, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals, isObject, isEmpty, isUndefined } from '@blockera/utils';
import { prepare } from '@blockera/data-extractor';
import {
	isInnerBlock,
	isNormalState as _isNormalBlockState,
} from '@blockera/extensions/src/components/utils';
import { useBlockContext } from '@blockera/extensions/src/hooks/context';

/**
 * Internal dependencies
 */
import type {
	CalculatedAdvancedLabelProps,
	AdvancedLabelHookProps,
} from './types';
import { blockHasStates } from './helpers';
import type { TStates } from '@blockera/extensions/src/libs/block-states/types';

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
		isInnerBlock: false,
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
		} = select('blockera-core/extensions') || {};

		return {
			currentBlock: getExtensionCurrentBlock(),
			currentState: getExtensionCurrentBlockState(),
			currentInnerBlockState: getExtensionInnerBlockState(),
			currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
		};
	});
	// Get static blockeraInnerBlocks value to use as fallback.
	const { blockeraInnerBlocks } = useBlockContext();
	const currentBlockAttributes = useMemo(() => {
		let calculatedAttributes = blockAttributes;

		if (isInnerBlock(currentBlock)) {
			// Assume current inner block inside master secondary state!
			if (!_isNormalBlockState(currentState)) {
				if (
					!blockAttributes.blockeraBlockStates[currentState]
						?.breakpoints[currentBreakpoint]?.attributes
						?.blockeraInnerBlocks ||
					!blockAttributes.blockeraBlockStates[currentState]
						?.breakpoints[currentBreakpoint]?.attributes
						?.blockeraInnerBlocks[currentBlock]
				) {
					calculatedAttributes =
						blockeraInnerBlocks[currentBlock].attributes || {};
				} else {
					calculatedAttributes =
						blockAttributes.blockeraBlockStates[currentState]
							.breakpoints[currentBreakpoint].attributes
							?.blockeraInnerBlocks[currentBlock].attributes ||
						blockeraInnerBlocks[currentBlock].attributes ||
						{};
				}
			} else {
				calculatedAttributes =
					(blockAttributes.blockeraInnerBlocks[currentBlock] &&
						blockAttributes.blockeraInnerBlocks[currentBlock]
							.attributes) ||
					blockeraInnerBlocks[currentBlock].attributes ||
					{};
			}
		}

		return calculatedAttributes;
		// eslint-disable-next-line
	}, [blockAttributes, currentBlock]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			// Excluding advanced label for specified rule.
			// Rule:
			// - If current block not has any changed attributes!
			// - Recieved attribute is equals with "blockeraBlockStates".
			if (
				['', 'blockeraBlockStates'].includes(attribute) ||
				!currentBlockAttributes ||
				!Object.values(currentBlockAttributes).length
			) {
				return setLabelStatus({
					isChanged: false,
					isChangedOnNormal: false,
					isChangedOnOtherStates: false,
					isChangedOnCurrentState: false,
					isInnerBlock: isInnerBlock(currentBlock),
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
					isInnerBlock: isInnerBlock(currentBlock),
				});
			}
			const currentBlockState =
				currentBlockAttributes?.blockeraBlockStates[
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
					currentBlockAttributes?.blockeraBlockStates
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

									// to handle repeater properties
									if (
										isObject(stateValue[attribute]) &&
										!isObject(clonedDefaultValue) &&
										path
									) {
										const _stateValue = prepare(
											path,
											stateValue
										);

										return (
											!isEmpty(stateValue[attribute]) &&
											!isUndefined(_stateValue) &&
											!isEquals(
												_stateValue,
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
										!isEmpty(stateValue) &&
										!isUndefined(stateValue[attribute]) &&
										!isEquals(
											stateValue[attribute],
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

			let isChangedOnNormal = !!isChangedOnOtherStates?.normal;

			if (isObject(isChangedOnNormal)) {
				isChangedOnNormal = true;
			}

			const isChangedOnCurrentState =
				!!isChangedOnOtherStates[
					isInnerBlock(currentBlock)
						? currentInnerBlockState
						: currentState
				];

			setLabelStatus({
				isChanged,
				isChangedOnNormal,
				isChangedOnCurrentState,
				isChangedOnOtherStates:
					Object.keys(isChangedOnOtherStates).length > 0,
				isInnerBlock: isInnerBlock(currentBlock),
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
