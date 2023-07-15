/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { prepare } from '@publisher/data-extractor';
import { isNull, isObject, isBoolean, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { ControlContext } from '../index';
import { STORE_NAME as CONTROL_STORE_NAME } from '../../store';
import { STORE_NAME as REPEATER_STORE_NAME } from '../../repeater-control/store/constants';

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

	const { getControl } = isRepeaterControl()
		? select(REPEATER_STORE_NAME)
		: select(CONTROL_STORE_NAME);

	const {
		id,
		repeater: { itemId, repeaterId, defaultRepeaterItemValue } = {
			itemId: null,
			repeaterId: null,
			defaultRepeaterItemValue: null,
		},
		defaultValue,
		mergeInitialAndDefault,
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
		return (
			!isUndefined(args.repeater) &&
			isObject(args.repeater.defaultRepeaterItemValue)
		);
	}

	/**
	 * Retrieved control value
	 * to merge default and saved value for simple or repeater controls.
	 *
	 * @return {null|*} retrieved standard calculated value for current control!
	 */
	function getCalculatedInitValue() {
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

	const control = getControl(controlInfo.name);

	return {
		dispatch,
		value: getCalculatedInitValue(args),
		controlInfo: getControl(controlInfo.name),
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
				value: defaultValue,
				controlId: controlInfo.name,
				valueCleanup: control.valueCleanup,
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
				controlId: controlInfo.name,
				valueCleanup: control.valueCleanup,
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
