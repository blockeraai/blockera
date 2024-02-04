// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isEquals, omit } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { TBlockProps } from './types';
// import { detailedDiff } from 'deep-object-diff';

/**
 * Retrieve reply to question "is array equals?".
 *
 * @param {Array<any>} a first array
 * @param {Array<any>} b second array
 * @return {boolean} true on success, false when otherwise!
 */
export function arrayEquals(a: Array<any>, b: Array<any>): boolean {
	return hasSameProps(a, b);
}

/**
 * Creation extension id with block name.
 *
 * @param {string} blockName the blockName of selected block of block-editor.
 * @param {string} clientId the client id of selected block of block-editor.
 * @param {string} currentBlockType the current block type, by default master.
 * @param {string} id the base identifier.
 * @param {boolean} flag the flag for delete state type of generating id.
 *
 * @return {string} retrieved extension standard identifier.
 */
export function generateExtensionId(
	{ blockName, clientId }: TBlockProps,
	id: string,
	flag: boolean = true
): string {
	const {
		getExtensionCurrentBlock = () => 'master',
		getExtensionCurrentBlockState = () => 'normal',
	} = select('publisher-core/extensions') || {};

	const currentBlock = getExtensionCurrentBlock();
	const currentStateType = flag ? '-' + getExtensionCurrentBlockState() : '';

	return `${blockName}/${id}/${clientId}-${currentBlock}${currentStateType}`;
}

/**
 * Retrieve result of equal props in any component with object structure!
 *
 * @param {Object} prevProps the older component props
 * @param {Object} nextProps the newest component props
 * @return {boolean} true on success, false on otherwise!
 */
export function hasSameProps(
	// eslint-disable-next-line no-undef
	prevProps: $ReadOnly<Object> | Array<any>,
	// eslint-disable-next-line no-undef
	nextProps: $ReadOnly<Object> | Array<any>
): boolean {
	if (prevProps?.hasOwnProperty('setSettings')) {
		const keys = ['setSettings', 'handleOnChangeAttributes'];

		// Debug code!
		// 	console.log(
		// 		detailedDiff(omit(prevProps, keys), omit(nextProps, keys)),
		// 		isEquals(omit(prevProps, keys), omit(nextProps, keys))
		// 	);

		return isEquals(omit(prevProps, keys), omit(nextProps, keys));
	}

	return isEquals(prevProps, nextProps);
}

/**
 * Exclude or ignore default block attribute keys with regular expression.
 *
 * @return {Object} The regex pattern.
 */
export function ignoreDefaultBlockAttributeKeysRegExp(): Object {
	return /^(?!publisher\w+).*/i;
}
