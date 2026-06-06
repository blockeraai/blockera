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
import {
	ignoreBlockeraAttributeKeysRegExp,
	ignoreDefaultBlockAttributeKeysRegExp,
} from '../libs/utils';

export const propsAreEqual = (perv: Object, next: Object): boolean => {
	const excludeKeys = ['content', 'text'];

	return isEquals(
		omit(perv?.attributes, excludeKeys),
		omit(next?.attributes, excludeKeys)
	);
};

/**
 * Get attribute names that should be omitted when applying attributes cross-block.
 * Rich-text and source attributes can cause critical errors in WordPress blocks.
 * Shared by handleOnDetachStyle and block-settings Edit component.
 *
 * @param {Object} attributesSchema - Block attribute schema (e.g. from getBlockType or overrideAttributes).
 * @return {Array<string>} - Attribute names to omit.
 */
export const getIgnoredAttributesForSchema = (
	attributesSchema: Object
): Array<string> => {
	const ignored: Array<string> = [];
	if (!attributesSchema) {
		return ignored;
	}
	for (const attribute in attributesSchema) {
		const attr = attributesSchema[attribute];
		if (
			attr?.type === 'rich-text' ||
			(attr?.source !== undefined && attr?.source !== null)
		) {
			ignored.push(attribute);
		}
	}
	return ignored;
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
			ignoreBlockeraAttributeKeysRegExp().test(key);

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

/**
 * Preparing WordPress (non-blockera) attribute default values for block reset flows.
 *
 * @param {Object} rootAttributes the root attributes of registration time.
 * @param {Object} [currentAttributes] current block attributes used to clear customized native attrs.
 * @return {Object} the WordPress attribute defaults.
 */
export const prepareWordPressDefaultAttributesValues = (
	rootAttributes: Object,
	currentAttributes: Object = {}
): Object => {
	if (!rootAttributes) {
		return {};
	}

	const ignoredAttributes = getIgnoredAttributesForSchema(rootAttributes);
	const attributes: { [key: string]: any } = {};
	const reservedAttributes = ['className', 'metadata'];

	for (const key in rootAttributes) {
		if (ignoreBlockeraAttributeKeysRegExp().test(key)) {
			continue;
		}

		if (
			ignoredAttributes.includes(key) ||
			reservedAttributes.includes(key)
		) {
			continue;
		}

		if (rootAttributes[key].default !== undefined) {
			attributes[key] = rootAttributes[key].default;
			continue;
		}

		if (currentAttributes[key] !== undefined) {
			attributes[key] = undefined;
		}
	}

	return attributes;
};
