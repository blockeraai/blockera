// @flow

/**
 * Exclude or ignore default block attribute keys with regular expression.
 *
 * @return {Object} The regex pattern.
 */
export function ignoreDefaultBlockAttributeKeysRegExp(): Object {
	return /^(?!blockera\w+).*/i;
}

/**
 * Exclude or ignore blockera attribute keys with regular expression.
 *
 * @return {Object} The regex pattern.
 */
export function ignoreBlockeraAttributeKeysRegExp(): Object {
	return /^blockera\w+/i;
}
