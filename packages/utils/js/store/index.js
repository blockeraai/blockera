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
	const { name: blockName } = getSelectedBlock() || {};

	if (!blockName) {
		return;
	}

	const savedConfig = getExtension(name, blockName);

	if (isEquals(value, savedConfig)) {
		return;
	}

	const { updateExtension } = dispatch(STORE_NAME);

	updateExtension({
		name,
		blockName,
		newSupports: mergeObject(savedConfig, value),
	});
};
