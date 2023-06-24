/**
 * is a given value String?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isUndefined(value) {
	return value === undefined;
}

/**
 * is a given value String?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isEmpty(value) {
	if (isObject(value)) {
		const length = Object.getOwnPropertyNames(value).length;

		return (
			length === 0 ||
			(length === 1 && isArray(value)) ||
			(length === 2 && isArguments(value))
		);
	}
	return value === '';
}

/**
 * is a given value null?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isNull(value) {
	return value === null;
}

/**
 * is a given value NaN?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isNaN(value) {
	return Number.isNaN(value);
}

/**
 * is a given value number?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isNumber(value) {
	return Number.isFinite(value);
}

/**
 * is a given value Array?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isArray(value) {
	return (
		Array.isArray(value) ||
		Object.prototype.toString.call(value) === '[object Array]'
	);
}

/**
 * is a given value Boolean?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isBoolean(value) {
	return (
		value === true ||
		value === false ||
		Object.prototype.toString.call(value) === '[object Boolean]'
	);
}

/**
 * is a given value function?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isFunction(value) {
	return (
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
export function isJSON(value) {
	return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * is a given value object?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isObject(value) {
	return Object(value) === value;
}

/**
 * is a given value String?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isString(value) {
	return Object.prototype.toString.call(value) === '[object String]';
}

/**
 * is a given value RegExp?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isRegex(value) {
	return Object.prototype.toString.call(value) === '[object RegExp]';
}

/**
 * is a given value String?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isArguments(value) {
	return (
		Object.prototype.toString.call(value) === '[object Arguments]' ||
		(value !== null && typeof value === 'object' && 'callee' in value)
	);
}

/**
 * is string end with a given target parameter?
 *
 * @param {string} [string]
 * @param {string} [target]
 * @return {boolean} boolean
 */
export function isEndWith(string, target) {
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
export function isStartWith(string, target) {
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
export function isIncludes(string, target) {
	if (!isString(string)) {
		return false;
	}

	target += '';

	return string.indexOf(target) > -1;
}
