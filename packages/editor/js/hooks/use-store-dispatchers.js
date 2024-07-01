// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

export const useStoreDispatchers = (): Object => {
	const { updateBlockAttributes } = dispatch('core/block-editor');

	return {
		blockEditor: {
			updateBlockAttributes,
		},
	};
};
