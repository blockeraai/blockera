// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

export const useStoreSelectors = (): {
	editPost: Object,
	blockEditor: Object,
} => {
	const { __experimentalGetPreviewDeviceType } = select('core/edit-post');
	const { getSelectedBlock } = select('core/block-editor');

	return {
		editPost: {
			__experimentalGetPreviewDeviceType,
		},
		blockEditor: {
			getSelectedBlock,
		},
	};
};
