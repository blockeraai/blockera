/**
 * Publisher dependencies
 */
import { isArray, isInteger, isString } from '@publisher/utils';
import { prepare } from '@publisher/data-extractor';

/**
 * Is called dispatcher action from child?
 *
 * @param  {Object} action the action details of dispatcher
 * @return {boolean} true on success, false when otherwise!
 */
export function isActionFromChildRepeater(action) {
	return (
		isInteger(action.repeaterParentItemId) && isString(action.repeaterId)
	);
}

/**
 * has limitation in action?
 *
 * @param {Object} action the action of dispatcher
 * @return {boolean} true on success, false when otherwise!
 */
export function hasLimitation(action: Object): boolean {
	return isInteger(action.maxItems) && action.maxItems !== -1;
}

/**
 * Retrieve the control information
 *
 * @param {Object} state the state object
 * @param {Object} action the action of dispatcher
 * @return {null|*} the control information
 */
export function getControlInfo(state: Object, action: Object): null | any {
	if (!isString(action.controlId) || !action.controlId.length) {
		return null;
	}

	return state[action.controlId];
}

/**
 * has repeaterId prop exists in action and check is valid?
 *
 * @param {Object} controlValue the control value
 * @param {Object} action the action of dispatcher
 * @param {boolean} checkIsArray the flag for check prepare data value is Array?
 * @return {boolean|false} true on success, false when otherwise
 */
export function hasRepeaterId(
	controlValue: Object,
	action: Object,
	checkIsArray: boolean = true
) {
	return checkIsArray
		? isString(action.repeaterId) &&
				action.repeaterId.length &&
				isArray(prepare(action.repeaterId, controlValue))
		: isString(action.repeaterId) && action.repeaterId.length;
}

/**
 * Check repeaterId is Query?
 *
 * @param {string} action the repeater control identifier
 * @return {boolean|boolean} true on success, false when otherwise!
 */
export function isQuery(action: Object): boolean {
	const { repeaterId } = action;
	return repeaterId.split('.').length > 1 || /\[.*]/gi.test(repeaterId);
}
