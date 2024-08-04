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
import type { ControlContextRefCurrent } from '@blockera/controls';
import type { BlockDetail } from './block-states/types';

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
		getActiveInnerState = () => 'normal',
		getActiveMasterState = () => 'normal',
		getExtensionCurrentBlock = () => 'master',
		getExtensionCurrentBlockStateBreakpoint = () => getBaseBreakpoint(),
	} = select('blockera/extensions') || {};

	const currentBlock = getExtensionCurrentBlock();

	if (!flag) {
		return `${blockName}/${id}/${clientId}-${currentBlock}`;
	}

	// Assume control inside innerBlock and current innerBlock inside master block!
	if (
		!isNormalState(getActiveMasterState(clientId, currentBlock)) &&
		isInnerBlock(currentBlock)
	) {
		return `${blockName}/${id}/${clientId}-master-${currentBlock}-${getActiveInnerState(
			clientId,
			currentBlock
		)}-${getExtensionCurrentBlockStateBreakpoint()}`;
	}
	// Assume master block in normal state and current control inside inner block.
	if (isInnerBlock(currentBlock)) {
		return `${blockName}/${id}/${clientId}-${currentBlock}-${getActiveInnerState(
			clientId,
			currentBlock
		)}-${getExtensionCurrentBlockStateBreakpoint()}`;
	}

	return `${blockName}/${id}/${clientId}-${currentBlock}-${getActiveMasterState(
		clientId,
		currentBlock
	)}-${getExtensionCurrentBlockStateBreakpoint()}`;
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
 * Is reference of sets value one of types "reset" or "reset_all_states"?
 *
 * @param {ControlContextRefCurrent} ref the reference of control context provider while calling setState.
 *
 * @return {boolean} true on success, false on otherwise!
 */
export function isResetRef(ref: ControlContextRefCurrent): boolean {
	return ['reset', 'reset_all_states'].includes(ref?.action);
}

/**
 * Validate compatibility run while if it needs.
 *
 * @param {BlockDetail} blockInfo the block information while validation compatibility execution.
 *
 * @return {boolean} true on success, false on otherwise!
 */
export function isBlockNotOriginalState(blockInfo: BlockDetail): boolean {
	const { isNormalState, isBaseBreakpoint, isMasterBlock } = blockInfo;

	return !isNormalState || !isBaseBreakpoint || !isMasterBlock;
}

/**
 * Validate compatibility run while if it needs.
 *
 * @param {BlockDetail} blockInfo the block information while validation compatibility execution.
 * @param {ControlContextRefCurrent} ref the reference of control context provider while calling setState.
 *
 * @return {boolean} true on success, false on otherwise!
 */
export function isInvalidCompatibilityRun(
	blockInfo: BlockDetail,
	ref: ControlContextRefCurrent
): boolean {
	return isBlockNotOriginalState(blockInfo) && !isResetRef(ref);
}
