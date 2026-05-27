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

/**
 * Resolves inner block item from blockeraInnerBlocks (wrapped or legacy shape).
 *
 * @param {Object} attributes Block attributes.
 * @param {string} innerBlock Inner block key.
 * @return {Object|void} Inner block item.
 */
export const getBlockeraInnerBlockItem = (
	attributes: Object,
	innerBlock: string
): Object | void => {
	if (attributes?.blockeraInnerBlocks?.value?.[innerBlock]) {
		return attributes.blockeraInnerBlocks.value[innerBlock];
	}

	if (attributes?.blockeraInnerBlocks?.[innerBlock]) {
		return attributes.blockeraInnerBlocks[innerBlock];
	}

	return undefined;
};

/**
 * @param {Object} innerBlocks Registered inner blocks.
 * @param {string} innerBlock Inner block key.
 * @param {string} key dataCompatibility key.
 * @return {boolean} true on success, false on failure.
 */
export const hasDataCompatibility = (
	innerBlocks: Object,
	innerBlock: string,
	key: string
): boolean => {
	return Boolean(
		innerBlocks?.[innerBlock]?.settings?.dataCompatibility?.includes(key)
	);
};

/**
 * theme.json element key for WP `style.elements` / `elements` (from block settings).
 *
 * @param {Object} innerBlocks Registered inner blocks map.
 * @param {string} innerBlock Inner block registry key.
 * @return {string} Element key (e.g. link, button, h1).
 */
export const resolveDataCompatibilityElement = (
	innerBlocks: Object,
	innerBlock: string
): string => {
	const fromSettings =
		innerBlocks?.[innerBlock]?.settings?.dataCompatibilityElement;

	if (fromSettings) {
		return fromSettings;
	}

	if (innerBlock.startsWith('elements/')) {
		return innerBlock.replace(/^elements\//, '');
	}

	return innerBlock;
};
