// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { hasSameProps } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { TBlockProps } from './types';
import { isInnerBlock } from '../components/utils';
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
		getExtensionInnerBlockState = () => 'normal',
		getExtensionCurrentBlockState = () => 'normal',
		getExtensionCurrentBlockStateBreakpoint = () => 'laptop',
	} = select('publisher-core/extensions') || {};

	const currentBlock = getExtensionCurrentBlock();
	let currentStateType = flag ? '-' + getExtensionCurrentBlockState() : '';

	if (isInnerBlock(currentBlock)) {
		currentStateType = flag ? '-' + getExtensionInnerBlockState() : '';
	}

	return `${blockName}/${id}/${clientId}-${currentBlock}${currentStateType}-${getExtensionCurrentBlockStateBreakpoint()}`;
}

/**
 * Exclude or ignore default block attribute keys with regular expression.
 *
 * @return {Object} The regex pattern.
 */
export function ignoreDefaultBlockAttributeKeysRegExp(): Object {
	return /^(?!publisher\w+).*/i;
}
