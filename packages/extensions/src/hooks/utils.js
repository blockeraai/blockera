/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * Upper Case first character of word
 *
 * @param {string} word word string
 * @returns {string} word with upper case first char!
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

/**
 * Extracts file as object included all exports of modules!
 *
 * @param {string} filePath the file path
 * @returns {Object} extracted file submodules.
 */
export async function getFileExtracts(filePath: string): Object {
	console.log('../../../../../../' + filePath);
	const extracted = await import('../../../../../../' + filePath);

	console.log(extracted);
}
