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
	rootAttributes: Object
): Object => {
	// Extracting default prop of items and assigning to a new object
	const attributes: { [key: string]: any } = {};

	for (const key in rootAttributes) {
		if (ignoreDefaultBlockAttributeKeysRegExp().test(key)) {
			continue;
		}

		if (rootAttributes[key].default !== undefined) {
			attributes[key] = {
				value: rootAttributes[key].default,
			};

			continue;
		}

		switch (rootAttributes[key]?.type) {
			case 'string':
				attributes[key] = {
					value: '',
				};
				break;
			case 'object':
				attributes[key] = {
					value: {},
				};
				break;
			case 'array':
				attributes[key] = {
					value: [],
				};
				break;
			case 'boolean':
				attributes[key] = {
					value: false,
				};
				break;
			case 'number':
			case 'integer':
				attributes[key] = {
					value: 0,
				};
				break;
			case 'null':
				attributes[key] = {
					value: null,
				};
				break;
		}
	}

	return attributes;
};
