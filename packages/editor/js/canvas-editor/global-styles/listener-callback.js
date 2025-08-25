// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../store';

export const sharedListenerCallback = (blockName: string): void => {
	const { setSelectedBlockStyle } = dispatch(STORE_NAME);

	setSelectedBlockStyle(blockName);
};
