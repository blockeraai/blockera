/**
 * External dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';

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
 * Add custom Publisher props identifier to selected blocks
 *
 * @param {Object} props Block props
 * @return {{}|Object} Block props extended with Publisher Extensions.
 */
export const useAttributes = (props: Object): Object => {
	const extendedProps = { ...props };

	if (isUndefined(extendedProps.attributes.publisherPropsId)) {
		const d = new Date();
		extendedProps.attributes.publisherPropsId =
			'' +
			d.getMonth() +
			d.getDate() +
			d.getHours() +
			d.getMinutes() +
			d.getSeconds() +
			d.getMilliseconds();
	}

	return extendedProps;
};
