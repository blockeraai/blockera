// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { hasSameProps } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { TBlockProps } from './types';
import { isInnerBlock, isNormalState } from '../components/utils';
import { getBaseBreakpoint } from '../../canvas-editor/components/breakpoints/helpers';
import type { InnerBlockType } from './inner-blocks/types';
import { STORE_NAME } from './base/store/constants';

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
		getExtensionCurrentBlockStateBreakpoint = () => getBaseBreakpoint(),
	} = select('blockera/extensions') || {};

	const currentBlock = getExtensionCurrentBlock();

	if (!flag) {
		return `${blockName}/${id}/${clientId}-${currentBlock}`;
	}

	// Assume control inside innerBlock and current innerBlock inside master block!
	if (
		!isNormalState(getExtensionCurrentBlockState()) &&
		isInnerBlock(currentBlock)
	) {
		return `${blockName}/${id}/${clientId}-master-${currentBlock}-${getExtensionInnerBlockState()}-${getExtensionCurrentBlockStateBreakpoint()}`;
	}
	// Assume master block in normal state and current control inside inner block.
	if (isInnerBlock(currentBlock)) {
		return `${blockName}/${id}/${clientId}-${currentBlock}-${getExtensionInnerBlockState()}-${getExtensionCurrentBlockStateBreakpoint()}`;
	}

	return `${blockName}/${id}/${clientId}-${currentBlock}-${getExtensionCurrentBlockState()}-${getExtensionCurrentBlockStateBreakpoint()}`;
}

/**
 * Exclude or ignore default block attribute keys with regular expression.
 *
 * @return {Object} The regex pattern.
 */
export function ignoreDefaultBlockAttributeKeysRegExp(): Object {
	return /^(?!blockera\w+).*/i;
}

/**
 * Get extensions config order by block name and current block type.
 *
 * @param {string} blockName the WordPress block name.
 * @param {'master' | InnerBlockType | string} currentBlock the current block type.
 *
 * @return {Object} the extensions config.
 */
export function getExtensionConfig(
	blockName: string,
	currentBlock: 'master' | InnerBlockType | string
): Object {
	// Access to extensions configuration for master and inner block from Blockera internal base extension store apis.
	const { getExtensions, getDefinition } = select(STORE_NAME);
	// By default config store master block configuration.
	let config = getExtensions(blockName);

	// Assume current block is one of inner block types,
	// in this case we should override extensions configuration order by current block identifier and selected block name.
	if (isInnerBlock(currentBlock)) {
		config = getDefinition(currentBlock, blockName);
	}

	return config;
}
