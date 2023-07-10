/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useContext, useEffect, useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	isArray,
	isBoolean,
	isFunction,
	isNull,
	isObject,
	isUndefined,
} from '@publisher/utils';
import { prepare } from '@publisher/data-extractor';

/**
 * Internal dependencies
 */
import { ControlContext } from './index';
import { STORE_NAME } from '../store/constants';

//eslint-disable-next-line
/**
 * Use control context data as react custom hook!
 *
 * @param {Object} args the control arguments
 * @return {Object} retrieved object of helpers to work with control!
 */
export const useControlContext = (args) => {
	const {
		controlInfo,
		value: savedValue,
		dispatch,
	} = useContext(ControlContext);

	//Store in controlInfo in local state to handle onChange with valueCleanUp
	const [control, setControl] = useState(controlInfo);

	const calculatedInitValue = getCalculatedInitValue(args);

	useEffect(() => {
		if (!isUndefined(args)) {
			const { modifyControlInfo } = dispatch;

			//modify control with `valueCleanup` of arguments
			modifyControlInfo({
				controlId: controlInfo.name,
				info: { valueCleanup: args.valueCleanup },
			});

			const { getControl } = select(STORE_NAME);

			setControl(getControl(controlInfo.name));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { valueCleanup, onChange } = control;

	useEffect(() => {
		if (!isUndefined(args)) {
			if (isFunction(onChange))
				// eslint-disable-next-line no-unused-expressions
				isFunction(valueCleanup)
					? onChange(valueCleanup(calculatedInitValue))
					: onChange(getCalculatedInitValue(calculatedInitValue));
		}
		// eslint-disable-next-line
	}, [calculatedInitValue, onChange, valueCleanup]);

	if (isUndefined(args)) {
		return {
			value: savedValue,
			dispatch,
			controlInfo,
		};
	}

	const {
		repeater: { itemId, repeaterId, defaultRepeaterItemValue } = {
			itemId: null,
			repeaterId: null,
			defaultRepeaterItemValue: null,
		},
		defaultValue,
	} = args;

	/**
	 * @see ../../store/actions.js file to check available actions of dispatcher!
	 */
	const { modifyControlValue, changeRepeaterItem } = dispatch;

	/**
	 * is repeater control?
	 *
	 * @return {boolean} true on success, false when otherwise!
	 */
	function isRepeaterControl() {
		return isArray(savedValue) && isObject(args.defaultRepeaterItemValue);
	}

	/**
	 * Merged control info with customize settings
	 *
	 * @param {Object} controlInfo the current control context information
	 * @return {{}} the merged info of control context
	 */
	function mergedControlInfo(controlInfo) {
		return {
			...controlInfo,
			onChange: isFunction(onChange)
				? {
						...controlInfo,
						onChange,
				  }
				: controlInfo.onChange,
			valueCleanup: isFunction(valueCleanup)
				? {
						...controlInfo,
						valueCleanup,
				  }
				: controlInfo.valueCleanup,
		};
	}

	/**
	 * Retrieved control value
	 * to merge default and saved value for simple or repeater controls.
	 *
	 * @param {Object} args the arguments of control consumer
	 *
	 * @return {null|*} retrieved standard calculated value for current control!
	 */
	function getCalculatedInitValue(args) {
		if (!isUndefined(args)) {
			const {
				id,
				repeater: { defaultRepeaterItemValue } = {
					itemId: null,
					repeaterId: null,
					defaultRepeaterItemValue: null,
				},
				defaultValue,
				mergeInitialAndDefault,
			} = args;

			if (isUndefined(savedValue) || isNull(savedValue)) {
				return defaultValue;
			}

			if (mergeInitialAndDefault) {
				if (isObject(savedValue) && isObject(defaultValue))
					return { ...defaultValue, ...savedValue };

				// merge default value to object elements inside initialValue
				// used for repeaters
				if (isRepeaterControl()) {
					savedValue.forEach((item, itemId) => {
						if (isObject(item)) {
							savedValue[itemId] = {
								...defaultRepeaterItemValue,
								...item,
							};
						}
					});
				}
			}

			return isUndefined(id) ? savedValue : prepare(id, savedValue);
		}

		return savedValue;
	}

	return {
		dispatch,
		controlInfo: mergedControlInfo(control),
		value: calculatedInitValue,
		/**
		 * Reset control value to default value.
		 */
		resetToDefault: () => {
			//TODO: implements reset repeater all items to specific value
			if (isRepeaterControl()) {
				changeRepeaterItem({
					itemId,
					repeaterId,
					controlId: controlInfo.name,
					value: defaultRepeaterItemValue,
				});

				return;
			}

			modifyControlValue({
				valueCleanup,
				value: defaultValue,
				controlId: controlInfo.name,
			});
		},
		/**
		 * Reset control value to saved value on database.
		 */
		resetToSavedValue: (value) => {
			//TODO: implements reset repeater all items to specific value
			if (isRepeaterControl()) {
				changeRepeaterItem({
					value,
					itemId,
					repeaterId,
					controlId: controlInfo.name,
				});

				return;
			}

			modifyControlValue({
				value,
				valueCleanup,
				controlId: controlInfo.name,
			});
		},
		// eslint-disable-next-line
		/**
		 * Toggle control value when value is boolean else returning false value.
		 *
		 * @return {boolean} toggled control value!
		 */
		toggleValue: () => {
			if (!isBoolean(savedValue)) {
				return false;
			}

			modifyControlValue({
				value: !savedValue,
				controlId: controlInfo.name,
			});
		},
	};
};
