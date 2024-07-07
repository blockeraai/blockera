// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState, useEffect, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { prepare } from '@blockera/data-editor';
import { isEquals, isObject, isEmpty, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	isInnerBlock,
	isNormalState as _isNormalState,
} from '../../extensions/components/utils';
import { useBlockContext } from '../../extensions/hooks/context';
import { isNormalStateOnBaseBreakpoint } from '../../extensions/libs/block-states/helpers';
import type {
	CalculatedAdvancedLabelProps,
	AdvancedLabelHookProps,
} from './types';
import { blockHasStates } from './helpers';
import type {
	TStates,
	BreakpointTypes,
} from '../../extensions/libs/block-states/types';
import { getBaseBreakpoint } from '../../canvas-editor';

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
	const baseBreakpoint = getBaseBreakpoint();
	const [labelStatus, setLabelStatus] = useState({
		isChanged: false,
		isChangedNormalStateOnBaseBreakpoint: false,
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
			getExtensionCurrentBlockStateBreakpoint = () => baseBreakpoint,
		} = select('blockera/extensions') || {};

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
		const calculatedAttributes = blockAttributes;

		if (isInnerBlock(currentBlock)) {
			if (
				!isNormalStateOnBaseBreakpoint(currentState, currentBreakpoint)
			) {
				if (
					!isNormalStateOnBaseBreakpoint(
						currentInnerBlockState,
						currentBreakpoint
					)
				) {
					return (
						prepare(
							`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${currentBlock}].attributes.blockeraInnerBlocks[${currentBlock}].attributes.blockeraBlockStates[${currentInnerBlockState}].breakpoints[${currentBreakpoint}].attributes`,
							calculatedAttributes
						) || {}
					);
				}

				return (
					prepare(
						`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${currentBlock}].attributes`,
						calculatedAttributes
					) ||
					blockeraInnerBlocks[currentBlock]?.attributes ||
					{}
				);
			}

			return (
				prepare(
					`blockeraInnerBlocks[${currentBlock}].attributes`,
					calculatedAttributes
				) ||
				blockeraInnerBlocks[currentBlock]?.attributes ||
				{}
			);
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
					isChangedNormalStateOnBaseBreakpoint: false,
					isChangedOnOtherStates: false,
					isChangedOnCurrentState: false,
					isInnerBlock: isInnerBlock(currentBlock),
					isChangedOnCurrentBreakpointNormal: false,
				});
			}

			// Assume block has not any states!
			if (!blockHasStates(currentBlockAttributes)) {
				const isChanged = !isEquals(defaultValue, value);

				if (
					!isNormalStateOnBaseBreakpoint(
						isInnerBlock(currentBlock)
							? currentInnerBlockState
							: currentState,
						currentBreakpoint
					)
				) {
					return setLabelStatus({
						isChanged: false,
						isChangedNormalStateOnBaseBreakpoint: isChanged,
						isChangedOnOtherStates: isChanged,
						isChangedOnCurrentState: false,
						isInnerBlock: isInnerBlock(currentBlock),
						isChangedOnCurrentBreakpointNormal: isChanged,
					});
				}

				return setLabelStatus({
					isChanged,
					isChangedNormalStateOnBaseBreakpoint: isChanged,
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

					// * to removing blockeraAttribute from path ...
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
										getBaseBreakpoint() ===
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

			const isChangedNormalStateOnBaseBreakpoint =
				isChangedOnSpecificStateAndBreakpoint(
					currentBlockAttributes,
					currentState,
					false
				);

			const isChangedOnCurrentBreakpointAndState = (
				breakpoint: BreakpointTypes,
				stateType: TStates
			) => {
				if (isUndefined(breakpoint))
					return isChanged && _isNormalState(stateType);

				const stateValue =
					currentBreakpoint === baseBreakpoint && isNormalState
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
					currentBreakpoint === baseBreakpoint
						? currentBlockAttributes
						: currentBlockAttributes.blockeraBlockStates.normal
								?.breakpoints[currentBreakpoint]?.attributes,
					currentState,
					false
				);

			setLabelStatus({
				isChanged,
				isChangedNormalStateOnBaseBreakpoint,
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
