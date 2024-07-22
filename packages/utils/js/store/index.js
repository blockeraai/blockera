// @flow

/**
 * External dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { isEquals } from '../array';
import { mergeObject } from '../object';

export const updateConfig = (name: string, value: Object): void => {
	const STORE_NAME = 'blockera/extensions/config';
	const { getExtension } = select(STORE_NAME) || {};

	if (!getExtension) {
		return;
	}

	const { getSelectedBlock = () => ({}) } = select('core/block-editor');
	const { clientId } = getSelectedBlock() || {};

	if (!clientId) {
		return;
	}

	const savedConfig = getExtension(name, clientId);

	if (isEquals(value, savedConfig)) {
		return;
	}

	const { updateExtension } = dispatch(STORE_NAME);

	updateExtension({
		name,
		clientId,
		newSupports: mergeObject(savedConfig, value),
	});
};
