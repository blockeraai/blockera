// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import featuresStack from './Modules';
import { STORE_NAME } from './Js/store';
import type { TFeature } from './Js/types';

export const unstableBootstrapServerSideFeatures = (
	features: Array<string>
): void => {
	for (const featureId of features) {
		// While we are in the server side, we need to check if the feature is supported.
		if (!featuresStack.hasOwnProperty(featureId)) {
			continue;
		}

		const standardFeature: TFeature = {
			name: featureId,
			...featuresStack[featureId],
		};

		dispatch(STORE_NAME).registerFeature(standardFeature);
	}
};

export * from './Js/use-block-features';
