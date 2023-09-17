import { isObject } from '@publisher/utils';

/**
 * is block extension?
 *
 * @param {string} type the block extension string must be equal with "block"
 * @return {boolean} true on success, false when otherwise!
 */
export const isBlockTypeExtension = ({ type }) => 'block' === type;

/**
 * is active extension?
 *
 * @param {string} fieldConfig the field config
 * @return {boolean} true on success, false when otherwise!
 */
export const isActiveField = (fieldConfig) =>
	isObject(fieldConfig) ? fieldConfig?.status : true === fieldConfig;

/**
 * is enable extension?
 *
 * @param {Object} extension the target extension
 * @return {boolean} true on success, false on otherwise
 */
export const isEnableExtension = (extension) => true === extension?.status;
