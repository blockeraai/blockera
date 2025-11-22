// @flow

/**
 * Returns the blockera global styles meta data from the window object.
 *
 * @return {Object} The blockera global styles meta data.
 */
export const getBlockeraGlobalStylesMetaData = (): Object => {
	const { blockeraGlobalStylesMetaData } = window;

	return 'object' === typeof blockeraGlobalStylesMetaData
		? blockeraGlobalStylesMetaData
		: {};
};

/**
 * Sets the blockera global styles meta data in the window object.
 *
 * @param {Object} metaData The blockera global styles meta data.
 * @return {void}
 */
export const setBlockeraGlobalStylesMetaData = (metaData: Object): void => {
	window.blockeraGlobalStylesMetaData = metaData;
};
