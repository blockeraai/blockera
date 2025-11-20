// @flow

/**
 * Blockera dependencies
 */
import { isEquals, omit } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { TStates } from '../libs/block-card/block-states/types';
import type { InnerBlockType } from '../libs/block-card/inner-blocks/types';
import { ignoreDefaultBlockAttributeKeysRegExp } from '../libs/utils';

export const propsAreEqual = (perv: Object, next: Object): boolean => {
	const excludeKeys = ['content', 'text'];

	return isEquals(
		omit(perv?.attributes, excludeKeys),
		omit(next?.attributes, excludeKeys)
	);
};

/**
 * is current block is inner block?
 *
 * @param {'master' | InnerBlockType | string} currentBlock The current block type.
 * @return {boolean} true on success, false on otherwise.
 */
export const isInnerBlock = (
	currentBlock: 'master' | InnerBlockType | string
): boolean => 'master' !== currentBlock;

/**
 * is current block on normal state?
 *
 * @param {TStates|string} selectedState The current selected state.
 * @return {boolean} true on success, false on otherwise.
 */
export const isNormalState = (selectedState: TStates | string): boolean =>
	'normal' === selectedState;

/**
 * Preparing blockera attributes default values.
 *
 * @param {Object} rootAttributes the root attributes of registration time.
 * @return {Object} the attributes cleaned.
 */
export const prepareBlockeraDefaultAttributesValues = (
	rootAttributes: Object,
	{
		context = 'block-inspector',
	}: { context?: 'global-styles-panel' | 'block-inspector' } = {}
): Object => {
	// Extracting default prop of items and assigning to a new object
	const attributes: { [key: string]: any } = {};

	for (const key in rootAttributes) {
		if (ignoreDefaultBlockAttributeKeysRegExp().test(key)) {
			continue;
		}

		const isGlobalStylesPanel =
			'global-styles-panel' === context &&
			!['blockeraPropsId', 'blockeraCompatId'].includes(key) &&
			/^blockera/i.test(key);

		if (rootAttributes[key].default !== undefined) {
			if (isGlobalStylesPanel) {
				attributes[key] = {
					value: rootAttributes[key].default,
				};
			} else {
				attributes[key] = rootAttributes[key].default;
			}

			continue;
		}

		switch (rootAttributes[key]?.type) {
			case 'string':
				if (isGlobalStylesPanel) {
					attributes[key] = {
						value: '',
					};
				} else {
					attributes[key] = '';
				}
				break;
			case 'object':
				if (isGlobalStylesPanel) {
					attributes[key] = {
						value: {},
					};
				} else {
					attributes[key] = {};
				}
				break;
			case 'array':
				if (isGlobalStylesPanel) {
					attributes[key] = {
						value: [],
					};
				} else {
					attributes[key] = [];
				}
				break;
			case 'boolean':
				if (isGlobalStylesPanel) {
					attributes[key] = {
						value: false,
					};
				} else {
					attributes[key] = false;
				}
				break;
			case 'number':
			case 'integer':
				if (isGlobalStylesPanel) {
					attributes[key] = {
						value: 0,
					};
				} else {
					attributes[key] = 0;
				}
				break;
			case 'null':
				if (isGlobalStylesPanel) {
					attributes[key] = {
						value: null,
					};
				} else {
					attributes[key] = null;
				}
				break;
		}
	}

	return attributes;
};
