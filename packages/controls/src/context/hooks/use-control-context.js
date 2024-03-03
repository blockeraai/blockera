// @flow
/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select } from '@wordpress/data';
import { useContext, useRef } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { prepare, update } from '@publisher/data-extractor';
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
import type { ControlContextHookProps, ControlContextRef } from '../types';

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

	const getControlPath = function (
		controlID: string,
		childControlId: string
	): string {
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
	};

	if ('undefined' === typeof args) {
		return {
			value: savedValue,
			dispatch,
			controlInfo,
			blockName: controlInfo.blockName,
			getControlPath,
		};
	}

	const initialRef = {
		path: '',
		reset: false,
		action: 'normal',
	};

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const ref: ControlContextRef = useRef(initialRef);

	const resetRef = (): void => {
		if (ref) {
			ref.current = initialRef;
		}
	};

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

	const _getCalculatedValue = memoize(() => getCalculatedInitValue());
	const calculatedValue = _getCalculatedValue();

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
				controlId: controlInfo.name,
			});
		}
	};

	//Call onChange function if is set valueCleanup as function to clean value else set all value details into parent state!
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const setValue = useControlEffect(
		{
			ref,
			onChange,
			resetRef,
			sideEffect,
			modifyValue,
			controlInfo,
			valueCleanup,
			value: calculatedValue,
			resetToNormal: controlInfo.resetToNormal,
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
	function getCalculatedInitValue(currentValue: any = null): any {
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
				// merge default value to object elements inside initialValue
				// used for repeaters
				if (isRepeaterControl()) {
					const mappedRepeaterValue = (items: Object): Object => {
						if (isEmpty(items)) {
							return {};
						}

						Object.entries(items).forEach(([itemId, item]) => {
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
						return !isObject(currentValue)
							? mappedRepeaterValue(defaultValue)
							: mappedRepeaterValue(currentValue);
					}

					return !isObject(repeaterValue)
						? mappedRepeaterValue(defaultValue)
						: mappedRepeaterValue(repeaterValue);
				}

				if (!isUndefined(id)) {
					return { ...defaultValue, ...prepare(id, currentValue) };
				}

				return { ...defaultValue, ...currentValue };
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
		setValue: (value, _ref = undefined) => {
			setValue(value, _ref || ref);

			modifyValue(value);

			resetRef();
		},
		value: calculatedValue,
		blockName: controlInfo.blockName,
		attribute: controlInfo.attribute,
		controlInfo: getControl(controlInfo.name),
		getControlPath,
		/**
		 * Reset control value to default value.
		 */
		resetToDefault: (args: Object): any => {
			const dataset = args?.attributes || defaultValue;

			if (
				['RESET_TO_NORMAL', 'RESET_TO_DEFAULT'].includes(args?.action)
			) {
				ref.current = {
					reset: true,
					action: 'reset',
					path: args?.path,
				};
			} else {
				resetRef();
			}

			if (args?.isRepeater) {
				const value = prepare(args?.path, dataset);

				modifyControlValue({
					value,
					controlId: controlInfo.name,
				});

				return value;
			}

			if (isUndefined(args?.path)) {
				setValue(defaultValue, ref);

				modifyControlValue({
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
					return update(item, args?.propId, value);
				}

				return item;
			};

			if (isUndefined(value)) {
				if (isArray(savedValue)) {
					value = savedValue.map(
						(item: Object, itemId: number): Object =>
							callback(item, itemId, defaultValue)
					);
				} else if (isObject(savedValue) && args?.propId) {
					value = {
						...savedValue,
						[args?.propId]: defaultValue[args?.propId],
					};
				} else if (isObject(savedValue) && isObject(defaultValue)) {
					value = {
						...savedValue,
						...defaultValue,
					};
				}

				setValue(value || '', ref);

				modifyControlValue({
					value: value || '',
					controlId: controlInfo.name,
				});

				return value || '';
			}

			if (isArray(savedValue)) {
				value = savedValue.map((item: Object, itemId: number): Object =>
					callback(item, itemId, value)
				);
			} else if (isObject(savedValue) && args?.propId) {
				value = update(savedValue, args.path, value);
			} else if (isObject(savedValue) && isObject(value)) {
				value = {
					...savedValue,
					...value,
				};
			}

			setValue(value, ref);

			modifyControlValue({
				value,
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
