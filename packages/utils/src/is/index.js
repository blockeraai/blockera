// @flow
/**
 * is a given value String?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isUndefined(value: any): boolean {
	return value === undefined;
}

/**
 * is a given value empty?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isEmpty(value: any): boolean {
	if (isArray(value)) {
		return value.length === 0;
	} else if (isObject(value)) {
		return Object.keys(value).length === 0;
	}

	return value === '';
}

/**
 * is a given value null?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isNull(value: any): boolean {
	return value === null;
}

/**
 * is a given value number?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isNumber(value: any): boolean {
	return Number.isFinite(value);
}

/**
 * is a given value Array?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isArray(value: any): boolean {
	return (
		Array.isArray(value) ||
		// $FlowFixMe
		Object.prototype.toString.call(value) === '[object Array]'
	);
}

/**
 * is a given value Boolean?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isBoolean(value: any): boolean {
	return (
		value === true ||
		value === false ||
		// $FlowFixMe
		Object.prototype.toString.call(value) === '[object Boolean]'
	);
}

/**
 * is a given value function?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isFunction(value: any): boolean {
	return (
		// $FlowFixMe
		Object.prototype.toString.call(value) === '[object Function]' ||
		typeof value === 'function'
	);
}

/**
 * is given value a pure JSON object?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isJSON(value: any): boolean {
	// $FlowFixMe
	return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * is a given value object?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isObject(value: any): boolean {
	return (
		Object(value) === value &&
		// $FlowFixMe
		Object.prototype.toString.call(value) !== '[object Array]' &&
		// $FlowFixMe
		Object.prototype.toString.call(value) !== '[object Function]'
	);
}

/**
 * is a given value String?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isString(value: any): boolean {
	// $FlowFixMe
	return Object.prototype.toString.call(value) === '[object String]';
}

/**
 * is a given value Integer?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isInteger(value: any): boolean {
	return Number.isInteger(value);
}

/**
 * is string end with a given target parameter?
 *
 * @param {string} [string]
 * @param {string} [target]
 * @return {boolean} boolean
 */
export function isEndWith(string: string, target: string): boolean {
	if (!isString(string)) {
		return false;
	}

	target += '';

	const position = string.length - target.length;

	return position >= 0 && string.indexOf(target, position) === position;
}

/**
 * is string end with a given target parameter?
 *
 * @param {string} [string]
 * @param {string} [target]
 * @return {boolean} boolean
 */
export function isStartWith(string: string, target: string): boolean {
	if (!isString(string)) {
		return false;
	}

	target += '';

	return string.indexOf(target) === 0;
}

/**
 * is a given string includes parameter target?
 *
 * @param {string} [string]
 * @param {string} [target]
 * @return {boolean} boolean
 */
export function isIncludes(string: string, target: string): boolean {
	if (!isString(string)) {
		return false;
	}

	target += '';

	return string.indexOf(target) > -1;
}
