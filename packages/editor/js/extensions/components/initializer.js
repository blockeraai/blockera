// @flow

/**
 * External dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getItem, freshItem, setItem } from '@blockera/storage';

/**
 * Internal dependencies
 */
import * as sections from '../libs/base/config';
import { getNormalizedCacheVersion } from '../helpers';

export const defaultValue = {
	blockSections: {
		expandAll: false,
		focusMode: false,
		defaultMode: true,
		collapseAll: false,
	},
	sections: {},
};

export const cacheKeyPrefix = 'BLOCKERA_EDITOR_SETTINGS';

export const bootstrapBlockAppSettings = () => {
	const { setBlockAppSettings } = dispatch('blockera/editor');
	const calculatedSections = Object.fromEntries(
		Object.entries(sections).map(([key, value]) => [
			key,
			{
				initialOpen: value.initialOpen,
			},
		])
	);

	const currentBlock = select(
		'blockera/extensions'
	).getExtensionCurrentBlock();
	const version = select('blockera/data').getEntity('blockera')?.version;
	const cacheKey = cacheKeyPrefix + '_' + getNormalizedCacheVersion(version);
	const cacheData = getItem(cacheKey);
	const initialState = {
		...defaultValue,
		sections: {
			master: calculatedSections,
			[currentBlock]: calculatedSections,
		},
		focusedSection: 'spacingConfig',
	};

	if (!cacheData) {
		freshItem(cacheKey, cacheKeyPrefix);
		setItem(cacheKey, initialState);
		setBlockAppSettings(initialState);

		return;
	}

	setItem(cacheKey, cacheData);
	setBlockAppSettings(cacheData);
};
