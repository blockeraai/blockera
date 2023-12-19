// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { prepare } from '@publisher/data-extractor';
import {
	isNull,
	isObject,
	isBoolean,
	isUndefined,
	isArray,
	isEmpty,
} from '@publisher/utils';

/**
 * Internal dependencies
 */
import { ControlContext } from '../index';
import { STORE_NAME as CONTROL_STORE_NAME } from '../../store';
import { STORE_NAME as REPEATER_STORE_NAME } from '../../libs/repeater-control/store/constants';
import useControlEffect from './use-control-effect';
import type { ControlContextHookProps } from '../types';

//eslint-disable-next-line
/**
 * Use control context data as react custom hook!
 *
 * @param {Object} args the control arguments
 * @return {Object} retrieved object of helpers to work with control!
 */
export const useControlContext = (args?: ControlContextHookProps): Object => {
	const {
		controlInfo,
		value: savedValue,
		dispatch,
	} = useContext(ControlContext);

	if ('undefined' === typeof args) {
		return {
			value: savedValue,
			dispatch,
			controlInfo,
		};
	}

	const { getControl } = isRepeaterControl()
		? select(REPEATER_STORE_NAME)
		: select(CONTROL_STORE_NAME);

	const {
		id,
		repeater: { repeaterId, defaultRepeaterItemValue } = {
			itemId: null,
			repeaterId: null,
			defaultRepeaterItemValue: null,
		},
		onChange,
		valueCleanup,
		defaultValue,
		sideEffect = false,
		mergeInitialAndDefault,
	} = args;

	const calculatedValue = getCalculatedInitValue();

	/**
	 * @see ../../store/actions.js file to check available actions of dispatcher!
	 */
	const { modifyControlValue } = dispatch;

	const modifyValue = (value: any): void => {
		// extends setValue default operation to modify flatten control value!
		if (isUndefined(id)) {
			modifyControlValue({
				value,
				controlId: controlInfo.name,
			});
			// extends setValue default operation to modify nested control value!
		} else if ('nested' === controlInfo?.type) {
			modifyControlValue({
				value,
				propId: id,
				valueCleanup,
				controlId: controlInfo.name,
			});
		}
	};

	//Call onChange function if is set valueCleanup as function to clean value else set all value details into parent state!
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const setValue = useControlEffect(
		{
			onChange,
			sideEffect,
			modifyValue,
			valueCleanup,
			value: calculatedValue,
		},
		[savedValue]
	);

	/**
	 * is repeater control?
	 *
	 * @return {boolean} true on success, false when otherwise!
	 */
	function isRepeaterControl(): boolean {
		return (
			!isUndefined(args?.repeater) &&
			isObject(args.repeater?.defaultRepeaterItemValue)
		);
	}

	/**
	 * Retrieved control value
	 * to merge default and saved value for simple or repeater controls.
	 *
	 * @param {any} currentValue the current control saved value.
	 *
	 * @return {null|*} retrieved standard calculated value for current control!
	 */
	function getCalculatedInitValue(currentValue?: any = null): any {
		if (isNull(currentValue)) {
			currentValue = savedValue;
		}

		if (
			isUndefined(currentValue) ||
			isNull(currentValue) ||
			isEmpty(currentValue)
		) {
			return defaultValue;
		}

		if (mergeInitialAndDefault) {
			if (isObject(currentValue) && isObject(defaultValue)) {
				if (!isUndefined(id)) {
					return { ...defaultValue, ...prepare(id, currentValue) };
				}

				return { ...defaultValue, ...currentValue };
			}

			// merge default value to object elements inside initialValue
			// used for repeaters
			if (isRepeaterControl()) {
				const mappedRepeaterValue = (
					items: Array<Object>
				): Array<Object> => {
					if (isEmpty(items)) {
						return [];
					}

					items.forEach((item, itemId) => {
						if (isObject(item)) {
							items[itemId] = {
								...defaultRepeaterItemValue,
								...item,
							};
						}
					});

					return items;
				};

				const repeaterValue = prepare(repeaterId, currentValue);

				if (isUndefined(repeaterId) || isUndefined(repeaterValue)) {
					return !isArray(currentValue)
						? mappedRepeaterValue(defaultValue)
						: mappedRepeaterValue(currentValue);
				}

				return !isArray(repeaterValue)
					? mappedRepeaterValue(defaultValue)
					: mappedRepeaterValue(repeaterValue);
			}
		}

		if (isUndefined(id)) {
			if (isEmpty(currentValue)) {
				return defaultValue;
			}

			return currentValue;
		}

		if (isEmpty(currentValue)) {
			return defaultValue;
		}

		const prep = prepare(id, currentValue);
		if (prep !== '' && !isUndefined(prep)) {
			return prep;
		}

		return defaultValue;
	}

	return {
		dispatch,
		setValue: (value) => {
			setValue(value);

			modifyValue(value);
		},
		value: calculatedValue,
		blockName: controlInfo.blockName,
		attribute: controlInfo.attribute,
		description: controlInfo.description,
		controlInfo: getControl(controlInfo.name),
		getControlPath(controlID: string, childControlId: string): string {
			// Assume childControlId is undefined, then hint to context provider main value.
			if (isUndefined(childControlId)) {
				return controlID;
			}
			// Assume childControlId started with open bracket char as an example: "[0].toggleOption", then concat controlID and childControlId with no separator.
			if ('[' === childControlId[0]) {
				return `${controlID}${childControlId}`;
			}

			// Assume childControlId started with property word name as an example: "toggleOption", then concatenate "controlID" and "childControlId" with "dot | ." separator.
			return `${controlID}.${childControlId}`;
		},
		/**
		 * Reset control value to default value.
		 */
		resetToDefault: (args: Object): any => {
			const dataset = args?.attributes || defaultValue;

			if (args?.isRepeater) {
				const value = prepare(args?.path, dataset);

				modifyControlValue({
					value,
					valueCleanup,
					controlId: controlInfo.name,
				});

				return value;
			}

			if (isUndefined(args?.path)) {
				setValue(defaultValue);

				modifyControlValue({
					valueCleanup,
					value: defaultValue,
					controlId: controlInfo.name,
				});

				return defaultValue;
			}

			let value = prepare(args?.path, dataset);

			const callback = (
				item: Object,
				itemId: number,
				value: any
			): Object => {
				if (itemId === args?.repeaterItem) {
					return {
						...item,
						[args?.propId]: value,
					};
				}

				return item;
			};

			if (isUndefined(value)) {
				if (isArray(savedValue)) {
					value = savedValue.map(
						(item: Object, itemId: number): Object =>
							callback(
								item,
								itemId,
								defaultRepeaterItemValue && args?.propId
									? defaultRepeaterItemValue[args.propId]
									: defaultValue
							)
					);
				} else if (isObject(savedValue)) {
					value = {
						...savedValue,
						[args?.propId]: defaultValue[args?.propId],
					};
				}

				setValue(value);

				modifyControlValue({
					value,
					valueCleanup,
					controlId: controlInfo.name,
				});

				return value;
			}

			if (isArray(savedValue)) {
				value = savedValue.map((item: Object, itemId: number): Object =>
					callback(item, itemId, value)
				);
			} else if (isObject(savedValue)) {
				value = {
					...savedValue,
					[args?.propId]: value,
				};
			}

			setValue(value);

			modifyControlValue({
				value,
				valueCleanup,
				controlId: controlInfo.name,
			});

			return value;
		},
		// eslint-disable-next-line
		/**
		 * Toggle control value when value is boolean else returning false value.
		 *
		 * @return {boolean} toggled control value!
		 */
		toggleValue: (): boolean => {
			if (!isBoolean(calculatedValue)) {
				return false;
			}

			modifyControlValue({
				value: !calculatedValue,
				controlId: controlInfo.name,
			});

			return !calculatedValue;
		},
		/**
		 * Return
		 *
		 * @return {boolean} toggled control value!
		 */
		getId: (id: string, childId: string): string => {
			if (!isUndefined(id)) {
				return `${id}.${childId}`;
			}

			return childId;
		},
	};
};
