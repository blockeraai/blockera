// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

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
	if (value === null) {
		// Checks for null and undefined
		return true;
	} else if (isArray(value) || isString(value)) {
		return value.length === 0;
	} else if (isObject(value)) {
		return Object.keys(value).length === 0;
	}

	return false; // If it's not a recognized type, it's not empty by this function's logic
}

/**
 * Is empty passed object?
 *
 * @param {Object} object any object
 * @return {boolean} true on success, false when otherwise!
 */
export function isEmptyObject(object: Object): boolean {
	return !object || !Object.keys(object).length;
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
	if (typeof value === 'number') {
		return Number.isFinite(value);
	}

	if (typeof value === 'string' && value.trim() !== '') {
		return !isNaN(Number(value));
	}

	return false;
}

/**
 * is a given value Array?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isArray(value: any): boolean {
	return Array.isArray(value);
}

/**
 * is a given value Boolean?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isBoolean(value: any): boolean {
	return typeof value === 'boolean';
}

/**
 * is a given value function?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isFunction(value: any): boolean {
	return typeof value === 'function';
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
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * is a given value String?
 *
 * @param {*} [value]
 * @return {boolean} boolean
 */
export function isString(value: any): boolean {
	return typeof value === 'string';
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

/**
 * Is loaded site editor?
 *
 * @return {boolean} true on success, false on otherwise!
 */
export function isLoadedSiteEditor(): boolean {
	return 'undefined' !== typeof select('core/edit-site');
}

/**
 * Is loaded post (or block) editor?
 *
 * @return {boolean} true on success, false on otherwise!
 */
export function isLoadedPostEditor(): boolean {
	return 'undefined' !== typeof select('core/edit-post');
}

/**
 * Checks if the given URL or domain is a localhost address
 *
 * @param {string} domain - URL or domain to check
 * @return {boolean} - true if localhost, false otherwise
 */
export function isLocalhost(domain: string): boolean {
	if (!domain) return false;

	// Create URL object if full URL is provided
	try {
		if (domain.includes('://')) {
			domain = new URL(domain).hostname;
		}
	} catch (e) {
		// Invalid URL, continue with original domain string
	}

	// Common localhost patterns
	const localhostPatterns = [
		/^localhost$/i, // localhost
		/^127\.0\.0\.1$/, // IPv4 localhost
		/^::1$/, // IPv6 localhost
		/^0\.0\.0\.0$/, // All IPv4 addresses
		/^.*\.localhost$/i, // *.localhost
		/^.*\.local$/i, // *.local
		/^.*\.test$/i, // *.test
		/^127\.\d+\.\d+\.\d+$/, // All 127.*.*.* IPv4 addresses
		/^192\.168\.\d+\.\d+$/, // Common local network IPv4
		/^10\.\d+\.\d+\.\d+$/, // Private network IPv4
		/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/, // Private network IPv4
	];

	return localhostPatterns.some((pattern) => pattern.test(domain));
}
