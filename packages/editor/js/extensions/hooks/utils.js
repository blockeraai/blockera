// @flow
/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isEmpty } from '@blockera/utils';

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

/**
 * Retrieve sanitized default attributes for block registration.
 *
 * @param {Object} attributes the registration block attributes
 * @param {Object} args the arguments helpful in the sanitizing process.
 *
 * @return {Object|{}} the sanitized block registration attributes.
 */
const _sanitizeDefaultAttributes = (
	attributes: Object,
	args?: {
		defaultWithoutValue: boolean,
	}
): Object => {
	const newAttributes: { [key: string]: Object } = {};
	const { defaultWithoutValue = false } = args || {};

	for (const name in attributes) {
		const attribute = attributes[name];

		// Exception for attribute type is not "object".
		if ('object' !== attribute.type) {
			newAttributes[name] = attribute;

			continue;
		}

		// Exception for default value is array with includes index "value" is empty array!
		if (
			Array.isArray(attribute?.default?.value) &&
			isEmpty(attribute?.default?.value)
		) {
			if (defaultWithoutValue) {
				newAttributes[name] = {
					...attribute,
					default: {},
				};

				continue;
			}

			newAttributes[name] = {
				...attribute,
				default: {
					value: {},
				},
			};

			continue;
		}

		if (defaultWithoutValue) {
			newAttributes[name] = {
				...attribute,
				default:
					undefined !== attribute?.default?.value
						? attribute.default.value
						: attribute?.default,
			};

			continue;
		}

		newAttributes[name] = attribute;
	}

	return newAttributes;
};

/**
 * Retrieve memoized sanitized default attributes for block registration.
 *
 * @param {Object} attributes the registration block attributes
 * @param {Object} args the arguments helpful in the sanitizing process.
 *
 * @return {Object|{}} the memoized block registration attributes.
 */
export const sanitizeDefaultAttributes: (
	attributes: Object,
	args?: {
		defaultWithoutValue: boolean,
	}
) => Object = memoize(_sanitizeDefaultAttributes);

/**
 * Retrieve sanitized block current attributes to comfortable access to values.
 *
 * @param {Object} attributes the block current attributes
 * @return {Object|{}} the sanitized block current attributes.
 */
const _sanitizeBlockAttributes = (attributes: Object): Object => {
	const newAttributes: { [key: string]: Object } = {};

	for (const name in attributes) {
		const attributeValue = attributes[name];

		// Exception for attribute value is object with includes "value" property.
		if (
			'object' === typeof attributeValue &&
			null !== attributeValue &&
			attributeValue.hasOwnProperty('value')
		) {
			newAttributes[name] = attributeValue.value;

			continue;
		}

		newAttributes[name] = attributeValue;
	}

	return newAttributes;
};

/**
 * Retrieve memoized sanitized block current attributes to comfortable access to values.
 *
 * @param {Object} attributes the block current attributes
 * @return {Object|{}} the memoized block current attributes.
 */
export const sanitizeBlockAttributes: (attributes: Object) => Object = memoize(
	_sanitizeBlockAttributes
);
