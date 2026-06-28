// @flow

/**
 * WordPress dependencies
 */
import { hasBlockSupport } from '@wordpress/blocks';

export type ParentListViewBlock = {
	clientId: string,
	blockName: string,
};

/**
 * Whether a block participates in List View parent navigation.
 * Mirrors Gutenberg `shouldRenderBlockListView` using public APIs.
 *
 * @param {string}   blockName         Block name.
 * @param {Function} getBlockOrder     Block editor `getBlockOrder` selector.
 * @param {Function} getBlockListSettings Block editor `getBlockListSettings` selector.
 * @param {string}   parentClientId    Parent block client ID.
 * @return {boolean} Whether the block should show list-view parent navigation.
 */
export function blockParticipatesInListView(
	blockName: string,
	getBlockOrder: (clientId: string) => Array<string>,
	getBlockListSettings: (
		clientId: string
	) => { allowedBlocks?: false | Array<string> } | void,
	parentClientId: string
): boolean {
	if (blockName === 'core/navigation') {
		return true;
	}

	if (!hasBlockSupport(blockName, 'listView')) {
		return false;
	}

	const allowedBlocks = getBlockListSettings(parentClientId)?.allowedBlocks;
	const isEmptyAndNoAllowedBlocks =
		getBlockOrder(parentClientId).length === 0 &&
		(allowedBlocks === false ||
			(Array.isArray(allowedBlocks) && allowedBlocks.length === 0));

	return !isEmptyAndNoAllowedBlocks;
}

/**
 * Find the nearest ancestor block that participates in List View navigation.
 *
 * @param {string|null|undefined} clientId          Selected block client ID.
 * @param {Function}              getBlockParents   Block editor `getBlockParents` selector.
 * @param {Function}              getBlockName        Block editor `getBlockName` selector.
 * @param {Function}              getBlockOrder       Block editor `getBlockOrder` selector.
 * @param {Function}              getBlockListSettings Block editor `getBlockListSettings` selector.
 * @return {ParentListViewBlock|null} Parent block info or null.
 */
export function getParentListViewBlock(
	clientId: string | null | void,
	getBlockParents: (clientId: string, ascending?: boolean) => Array<string>,
	getBlockName: (clientId: string) => string,
	getBlockOrder: (clientId: string) => Array<string>,
	getBlockListSettings: (
		clientId: string
	) => { allowedBlocks?: false | Array<string> } | void
): ParentListViewBlock | null {
	if (!clientId) {
		return null;
	}

	const parentClientId = getBlockParents(clientId, false).find((parentId) => {
		const parentBlockName = getBlockName(parentId);

		return blockParticipatesInListView(
			parentBlockName,
			getBlockOrder,
			getBlockListSettings,
			parentId
		);
	});

	if (!parentClientId) {
		return null;
	}

	return {
		clientId: parentClientId,
		blockName: getBlockName(parentClientId),
	};
}
