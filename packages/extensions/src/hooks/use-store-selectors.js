// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

export const useStoreSelectors = (): {
	blocks: Object,
	editPost: Object,
	blockEditor: Object,
} => {
	const { getBlockType } = select('core/blocks');
	const { getSelectedBlock } = select('core/block-editor');
	const { __experimentalGetPreviewDeviceType } =
		select('core/edit-post') || {};

	return {
		editPost: {
			__experimentalGetPreviewDeviceType,
		},
		blockEditor: {
			getSelectedBlock,
		},
		blocks: {
			getBlockType,
		},
	};
};
