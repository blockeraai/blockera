/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

export function ucFirstWord(word: string) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Retrieve the current block Id.
 *
 * @param {string} name
 * @return {string} return the blockId as string
 */
export const getCurrentBlockId = (name: string) =>
	ucFirstWord(name.replace('core/', ''));

export const enhance = compose(
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

export function getBlockEditorProp(blockName) {
	/**
	 * BlockEditor callbacks in Publisher Extensions Setup
	 */
	const blockEditorCallbacks = applyFilters(
		'publisher.core.extensions.blockEditorCallbacks',
		{}
	);

	if (!blockEditorCallbacks[getCurrentBlockId(blockName)]) {
		return {};
	}

	return blockEditorCallbacks[getCurrentBlockId(blockName)];
}
