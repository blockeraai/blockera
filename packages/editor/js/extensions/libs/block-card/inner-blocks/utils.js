// @flow

/**
 * Internal dependencies
 */
import type { InnerBlockModel } from './types';

/**
 * Is virtual block.
 *
 * @param {string} blockType The block type.
 * @return {boolean} true on success, false on failure.
 */
export const isVirtualBlock = (blockType: string): boolean => {
	return blockType.startsWith('elements/');
};

/**
 * Is element instance.
 *
 * @param {InnerBlockModel} entity the inner block model.
 * @return {boolean} true on success, false on failure.
 */
export const isElement = (entity: InnerBlockModel): boolean => {
	const isElementType = new RegExp('^elements/', 'ig').test(entity.name);

	if (isElementType) {
		return isElementType;
	}

	return (
		entity?.settings?.hasOwnProperty('level') ||
		entity?.settings?.hasOwnProperty('instanceId')
	);
};

/**
 * Is block instance.
 *
 * @param {InnerBlockModel} entity the inner block model.
 * @return {boolean} true on success, false on failure.
 */
export const isBlock = (entity: InnerBlockModel): boolean => {
	return new RegExp('^(core|woocommerce|blocksy|outermost)/', 'ig').test(
		entity.name
	);
};
