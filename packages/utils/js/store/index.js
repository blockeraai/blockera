// @flow

/**
 * External dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isEquals, mergeObject } from '@blockera/utils';

export const updateConfig = (key: string, value: Object): void => {
	const STORE_NAME = 'blockera-core/extensions/config';
	const { getExtension } = select(STORE_NAME) || {};

	if (!getExtension) {
		return;
	}

	const savedConfig = getExtension(key);

	if (isEquals(value, savedConfig)) {
		return;
	}

	const { updateExtension } = dispatch(STORE_NAME);

	updateExtension(key, mergeObject(savedConfig, value));
};
