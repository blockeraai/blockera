// @flow

/**
 * Blockera dependencies
 */
import { isObject } from '@blockera/utils';

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
 * is show extension?
 */
export const isShowField = (
	fieldConfig: Object,
	value: any,
	defaultValue: any
): boolean => {
	if (!isObject(fieldConfig)) {
		return false;
	}

	// Is active and has value
	if (
		fieldConfig?.status &&
		value !== undefined &&
		defaultValue !== undefined &&
		value !== defaultValue
	) {
		return true;
	}

	// Is active and selected to be shown
	return fieldConfig?.status && fieldConfig?.show;
};

/**
 * is enabled extension?
 *
 * @param {Object} extension the target extension
 * @return {boolean} true on success, false on otherwise
 */
export const isEnabledExtension = (extension: Object): boolean =>
	true === extension?.status;
