/**
 * Return a new object with the specified keys omitted.
 *
 * @param {Object} object Original object.
 * @param {Array}  keys   Keys to be omitted.
 *
 * @return {Object} Object with omitted keys.
 */
export function omit(object, keys) {
	return Object.fromEntries(
		Object.entries(object).filter(([key]) => !keys.includes(key))
	);
}

/**
 * is block extension?
 *
 * @param {string} type the block extension string must be equal with "block"
 * @return {boolean} true on success, false when otherwise!
 */
export const isBlockExtension = ({ type }) => 'block' === type;

/**
 * is field extension?
 *
 * @param {string} type the field extension string must be equal with "field"
 * @return {boolean} true on success, false when otherwise!
 */
export const isFieldExtension = ({ type }) => 'field' === type;

/**
 * is extension?
 *
 * @param {string} type the field extension string must be equal with "extension"
 * @return {boolean} true on success, false when otherwise!
 */
export const isExtension = ({ type }) => 'extension' === type;
