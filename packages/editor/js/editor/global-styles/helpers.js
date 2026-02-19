// @flow

/**
 * External dependencies
 */
import { select, dispatch } from '@wordpress/data';

/**
 * Returns the blockera global styles meta data from the blockera/editor store.
 * Falls back to window.blockeraGlobalStylesMetaData when store is not yet initialized.
 *
 * @return {Object} The blockera global styles meta data.
 */
export const getBlockeraGlobalStylesMetaData = (): Object => {
	try {
		const storeSelect = select('blockera/editor');
		if (storeSelect?.getBlockeraGlobalStylesMetaData) {
			const data = storeSelect.getBlockeraGlobalStylesMetaData();
			if (data && typeof data === 'object') {
				return data;
			}
		}
	} catch {
		// Store may not be ready yet
	}

	const { blockeraGlobalStylesMetaData } = window;
	return 'object' === typeof blockeraGlobalStylesMetaData
		? blockeraGlobalStylesMetaData
		: {};
};

/**
 * Sets the blockera global styles meta data in the blockera/editor store.
 *
 * @param {Object} metaData The blockera global styles meta data.
 * @return {void}
 */
export const setBlockeraGlobalStylesMetaData = (metaData: Object): void => {
	try {
		const storeDispatch = dispatch('blockera/editor');
		if (storeDispatch?.setBlockeraGlobalStylesMetaData) {
			storeDispatch.setBlockeraGlobalStylesMetaData(metaData);
		}
	} catch {
		// Store may not be ready yet - fallback to window for backward compatibility
		window.blockeraGlobalStylesMetaData = metaData;
	}
};
