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
import { prepare } from '@blockera/data-editor';
import {
	isInnerBlock,
	isNormalState as _isNormalBlockState,
} from '../../extensions/components/utils';
import { useBlockContext } from '@blockera/editor/js/extensions/hooks/context';

/**
 * Internal dependencies
 */
import type {
	CalculatedAdvancedLabelProps,
	AdvancedLabelHookProps,
} from './types';
import { blockHasStates } from './helpers';
import type {
	TStates,
	BreakpointTypes,
} from '../../extensions/libs/block-states/types';

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
		isChangedOnLaptopNormal: false,
		isChangedOnOtherStates: false,
		isChangedOnCurrentState: false,
		isInnerBlock: false,
		isChangedOnCurrentBreakpointNormal: false,
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
			// Assume current inner block inside master pseudo state!
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
			} else if ('laptop' !== currentBreakpoint) {
				calculatedAttributes =
					blockAttributes.blockeraBlockStates[currentState]
						.breakpoints[currentBreakpoint]?.attributes
						?.blockeraInnerBlocks[currentBlock].attributes || {};
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
					isChangedOnLaptopNormal: false,
					isChangedOnOtherStates: false,
					isChangedOnCurrentState: false,
					isInnerBlock: isInnerBlock(currentBlock),
					isChangedOnCurrentBreakpointNormal: false,
				});
			}

			// Assume block has not any states!
			if (!blockHasStates(currentBlockAttributes)) {
				const isChanged = !isEquals(defaultValue, value);

				return setLabelStatus({
					isChanged,
					isChangedOnLaptopNormal: isChanged,
					isChangedOnOtherStates: false,
					isChangedOnCurrentState: isChanged,
					isInnerBlock: isInnerBlock(currentBlock),
					isChangedOnCurrentBreakpointNormal: isChanged,
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
			const rootValue = prepare(path, currentBlockAttributes);

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

			const isChangedOnSpecificStateAndBreakpoint = (
				stateValue: Object,
				stateType: string,
				compareWithRootValue?: boolean = true
			) => {
				if (isEmpty(stateValue) || isUndefined(stateValue)) {
					return false;
				}

				if (isRepeater) {
					// Assume control is repeater.
					if (!isNormalState && 'normal' === stateType) {
						return (
							!isEmpty(stateValue[attribute]) &&
							!isUndefined(stateValue[attribute]) &&
							!isEquals(stateValue[attribute], clonedDefaultValue)
						);
					}

					return (
						!isEmpty(stateValue[attribute]) &&
						!isUndefined(stateValue[attribute]) &&
						!isEquals(stateValue[attribute], clonedDefaultValue)
					);
				}

				// To handle repeater nested labels
				if (
					isObject(stateValue[attribute]) &&
					!isObject(clonedDefaultValue) &&
					path
				) {
					const _stateValue = prepare(path, stateValue);

					// Compare with rootValue
					if (
						!isNormalState &&
						stateType !== 'normal' &&
						!isUndefined(rootValue) &&
						!isEquals(rootValue, clonedDefaultValue) &&
						compareWithRootValue
					) {
						return (
							!isEmpty(stateValue[attribute]) &&
							!isUndefined(_stateValue) &&
							!isEquals(_stateValue, rootValue)
						);
					}

					return (
						!isEmpty(stateValue[attribute]) &&
						!isUndefined(_stateValue) &&
						!isEquals(_stateValue, clonedDefaultValue)
					);
				}

				// Assume clonedDefaultValue is object
				if (
					isObject(stateValue[attribute]) &&
					isObject(clonedDefaultValue) &&
					path &&
					path.includes('blockera')
				) {
					const _stateValue = prepare(path, stateValue);

					// * to remove blocheraAttribute from path
					const preparedPath = path.substring(path.indexOf('.') + 1);

					const _clonedDefaultValue =
						prepare(preparedPath, clonedDefaultValue) ??
						clonedDefaultValue;

					// Compare with rootValue
					if (
						!isNormalState &&
						stateType !== 'normal' &&
						!isEquals(rootValue, _clonedDefaultValue) &&
						compareWithRootValue
					) {
						return (
							!isEmpty(stateValue[attribute]) &&
							!isUndefined(_stateValue) &&
							!isEquals(_stateValue, rootValue)
						);
					}

					return (
						!isEmpty(stateValue[attribute]) &&
						!isUndefined(_stateValue) &&
						!isEquals(_stateValue, _clonedDefaultValue)
					);
				}

				if (!isNormalState && 'normal' === stateType) {
					return (
						!isEmpty(stateValue) &&
						!isUndefined(stateValue[attribute]) &&
						!isEquals(stateValue[attribute], clonedDefaultValue)
					);
				}

				return (
					!isEmpty(stateValue) &&
					!isUndefined(stateValue[attribute]) &&
					!isEquals(stateValue[attribute], clonedDefaultValue)
				);
			};

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

									return isChangedOnSpecificStateAndBreakpoint(
										stateValue,
										stateType
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

			const isChangedOnLaptopNormal =
				isChangedOnSpecificStateAndBreakpoint(
					currentBlockAttributes,
					currentState,
					false
				);

			const isChangedOnCurrentBreakpointAndState = (
				breakpoint: BreakpointTypes,
				stateType: TStates
			) => {
				if (isUndefined(breakpoint)) return false;

				const stateValue =
					currentBreakpoint === 'laptop' && isNormalState
						? currentBlockAttributes
						: breakpoint?.attributes;

				return isChangedOnSpecificStateAndBreakpoint(
					stateValue,
					stateType
				);
			};

			const isChangedOnCurrentState =
				isChangedOnCurrentBreakpointAndState(
					isChangedOnOtherStates[
						isInnerBlock(currentBlock)
							? currentInnerBlockState
							: currentState
					]?.breakpoints[currentBreakpoint],
					currentState
				);

			const isChangedOnCurrentBreakpointNormal =
				isChangedOnSpecificStateAndBreakpoint(
					currentBreakpoint === 'laptop'
						? currentBlockAttributes
						: currentBlockAttributes.blockeraBlockStates.normal
								?.breakpoints[currentBreakpoint]?.attributes,
					currentState,
					false
				);

			setLabelStatus({
				isChanged,
				isChangedOnLaptopNormal,
				isChangedOnCurrentState,
				isChangedOnOtherStates:
					Object.keys(isChangedOnOtherStates).length > 0,
				isInnerBlock: isInnerBlock(currentBlock),
				isChangedOnCurrentBreakpointNormal,
			});
		}, delay);

		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line
	}, [
		value,
		attribute,
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
		currentBlockAttributes,
	]);

	return labelStatus;
};
