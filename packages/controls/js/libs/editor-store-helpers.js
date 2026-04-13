// @flow

/**
 * External dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { isEquals, mergeObject } from '@blockera/utils';

export const updateConfig = (name: string, value: Object): void => {
	const STORE_NAME = 'blockera/extensions/config';
	const { getExtension } = select(STORE_NAME) || {};

	if (!getExtension) {
		return;
	}

	const { getSelectedBlock = () => ({}) } = select('core/block-editor');
	let { name: blockName } = getSelectedBlock() || {};

	const { getSelectedBlockStyle } = select('blockera/editor');
	const { getActiveComplementaryArea } = select('core/interface');

	const activeComplementaryArea =
		getActiveComplementaryArea('core/edit-site');

	if ('edit-site/global-styles' === activeComplementaryArea) {
		blockName = getSelectedBlockStyle();
	}

	if (!blockName && 'edit-site/global-styles' !== activeComplementaryArea) {
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
