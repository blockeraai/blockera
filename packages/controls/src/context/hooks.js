/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';

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

/**
 * Internal dependencies
 */
import { ControlContext } from './index';
import { prepare } from '@publisher/data-extractor';

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

	if (isUndefined(args)) {
		return {
			value: savedValue,
			dispatch,
			controlInfo,
		};
	}

	const {
		id,
		onChange,
		repeater: { itemId, repeaterId, defaultRepeaterItemValue } = {
			itemId: null,
			repeaterId: null,
			defaultRepeaterItemValue: null,
		},
		valueCleanup,
		defaultValue,
		mergeInitialAndDefault,
	} = args;
	const calculatedInitValue = getCalculatedInitValue(id);

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
		return isArray(savedValue) && isObject(defaultRepeaterItemValue);
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
	 * @return {null|*} retrieved standard calculated value for current control!
	 */
	function getCalculatedInitValue(id) {
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

		if (isUndefined(id)) {
			return savedValue;
		}

		return prepare(id, savedValue);
	}

	return {
		dispatch,
		controlInfo: mergedControlInfo(controlInfo),
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
