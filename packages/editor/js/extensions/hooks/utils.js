// @flow
/**
 * External dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { omit, omitWithPattern } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { ignoreDefaultBlockAttributeKeysRegExp } from '../libs';

/**
 * Upper Case first character of word
 *
 * @param {string} word word string
 * @return {string} word with upper case first char!
 */
export function ucFirstWord(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Retrieve the current block Id.
 *
 * @param {string} name
 * @return {string} return the blockId as string
 */
export const getCurrentBlockId = (name: string): string =>
	ucFirstWord(name.replace('core/', ''));

export const enhance: Object = compose(
	/**
	 * @param {Function} WrappedBlockEdit A filtered BlockEdit instance.
	 * @return {Function} Enhanced component with merged state data props.
	 */
	withSelect((select) => {
		const CORE_BLOCK_EDITOR = 'core/block-editor';

		return {
			getBlocks: select(CORE_BLOCK_EDITOR).getBlocks,
			select,
			selected: select(CORE_BLOCK_EDITOR).getSelectedBlock(),
		};
	})
);

export const sanitizedBlockAttributes = (
	attributes: Object,
	availableAttributes: Object
): Object => {
	const omittedWPAttributes = omitWithPattern(
		attributes,
		ignoreDefaultBlockAttributeKeysRegExp()
	);

	const cleanupKeys = [];
	const attributeKeys = Object.keys(omittedWPAttributes);
	const attributeValues = Object.values(omittedWPAttributes);

	attributeValues.forEach((attributeValue: Object, index: number): void => {
		const attributeKey = attributeKeys[index];

		if ('blockeraIconLink' === attributeKey) {
			cleanupKeys.push(attributeKeys[index]);
			return;
		}

		if (attributeValue !== availableAttributes[attributeKey]?.default) {
			return;
		}

		cleanupKeys.push(attributeKeys[index]);
	});

	return omit(attributes, cleanupKeys);
};

/**
 * Retrieve sanitized default attributes for block registration.
 *
 * @param {Object} attributes the registration block attributes
 * @return {Object|{}} the override block registration attributes.
 */
export const sanitizeDefaultAttributes = (attributes: Object): Object => {
	const newAttributes = attributes || {};

	for (const name in newAttributes) {
		const attribute = newAttributes[name];

		// Exception for object types with default array value!
		if ('object' === attribute.type && Array.isArray(attribute.default)) {
			newAttributes[name].default = {};
		}
	}

	return newAttributes;
};
