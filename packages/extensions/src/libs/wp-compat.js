// @flow

/**
 * Internal dependencies
 */
import { sizeFeatures } from './size/wp-compat';
import { typoFeatures } from './typography/wp-compat';

export default {
	...sizeFeatures,
	...typoFeatures,
	// TODO: implements any other available features in publisher core application 👇
};
