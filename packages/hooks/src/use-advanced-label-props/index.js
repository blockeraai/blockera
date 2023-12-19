// @flow

/**
 * External dependencies
 */
import { isEquals, isObject } from '@publisher/utils';
import { prepare } from '@publisher/data-extractor';

/**
 * Internal dependencies
 */
import type {
	CalculatedAdvancedLabelProps,
	AdvancedLabelHookProps,
} from './types';

export const useAdvancedLabelProps = ({
	path,
	value,
	fieldId,
	attribute,
	isRepeater,
	defaultValue,
	currentState,
	isNormalState,
	blockAttributes,
	blockStateId,
	breakpointId,
}: AdvancedLabelHookProps): CalculatedAdvancedLabelProps => {
	const debugKey = 'publisherSpacing';
	if ('publisherBlockStates' === attribute) {
		return {
			isChanged: false,
			isChangedOnNormal: false,
			isChangedOnOtherStates: false,
		};
	}

	let _blockAttributes = blockAttributes[attribute];

	if (fieldId && !isRepeater) {
		if (debugKey === attribute) {
			console.log(debugKey, 1);
		}
		// Assume control has object type value.
		if (isObject(defaultValue)) {
			value = value[fieldId];
			defaultValue = defaultValue[fieldId];
			_blockAttributes = _blockAttributes[fieldId];
		}
	} else if (path && !isRepeater) {
		if (debugKey === attribute) {
			console.log(debugKey, 2);
		}
		const _value = prepare(path, value);

		if (_value) {
			value = _value;
		}

		const _defaultValue = prepare(path, defaultValue);

		if (_defaultValue) {
			defaultValue = _defaultValue;
		}

		_blockAttributes = prepare(path, blockAttributes);
	}

	const isChangedOnOtherStates =
		blockAttributes?.publisherBlockStates?.filter(
			(state: Object): boolean => {
				if (state.type === currentState) {
					return false;
				}

				return (
					state.breakpoints.filter((breakpoint) => {
						if (
							isNormalState &&
							!isEquals(_blockAttributes, value)
						) {
							return true;
						}

						let stateValue =
							breakpoint?.attributes &&
							breakpoint?.attributes[attribute];

						if (!stateValue) {
							return false;
						}

						// Assume control is repeater.
						if (isRepeater) {
							return !isEquals(stateValue, value);
						}

						if (fieldId) {
							// Assume control has object type value.
							if (isObject(defaultValue)) {
								stateValue = stateValue[fieldId];
							}
						} else if (path) {
							stateValue = prepare(path, stateValue);
						}

						return !isEquals(stateValue, value);
					}).length > 0
				);
			}
		);

	let isChanged = !isEquals(defaultValue, value);

	const stateAttributes =
		blockAttributes.publisherBlockStates[blockStateId].breakpoints[
			breakpointId
		].attributes;

	if (!isNormalState) {
		isChanged = stateAttributes[attribute]
			? !isEquals(stateAttributes[attribute], defaultValue)
			: false;
	}

	const isChangedOnNormal = !isEquals(_blockAttributes, defaultValue);

	if (debugKey === attribute) {
		// console.log(
		// 	isChangedOnNormal,
		// 	_blockAttributes,
		// 	defaultValue,
		// 	fieldId,
		// 	path
		// );
		// console.log(isChanged, isChangedOnNormal, isChangedOnOtherStates);
		// console.log(
		// 	attribute,
		// 	value,
		// 	defaultValue,
		// 	blockAttributes,
		// 	isChanged,
		// 	isChangedOnNormal,
		// 	isChangedOnOtherStates
		// );
	}

	return {
		isChanged,
		isChangedOnNormal,
		isChangedOnOtherStates: isChangedOnOtherStates?.length > 0,
	};
};
