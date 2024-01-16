// @flow

/**
 * Publisher dependencies
 */
import { isObject } from '@publisher/utils';

/**
 * is block extension?
 *
 * @param {string} type the block extension string must be equal with "block"
 * @return {boolean} true on success, false when otherwise!
 */
export const isBlockTypeExtension = ({ type }: { type: 'string' }): boolean =>
	'block' === type;

/**
 * is active extension?
 *
 * @param {Object} fieldConfig the field config
 * @return {boolean} true on success, false when otherwise!
 */
export const isActiveField = (fieldConfig: Object): boolean =>
	isObject(fieldConfig) ? fieldConfig?.status : true === fieldConfig;

/**
 * is enabled extension?
 *
 * @param {Object} extension the target extension
 * @return {boolean} true on success, false on otherwise
 */
export const isEnabledExtension = (extension: Object): boolean =>
	true === extension?.status;
