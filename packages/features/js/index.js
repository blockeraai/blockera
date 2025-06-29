// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import featuresStack from './libs';
import { STORE_NAME } from './store';
import type { TFeature } from './types';

export const unstableBootstrapServerSideFeatures = (features: {
	[key: string]: TFeature,
}): void => {
	for (const featureId in features) {
		if (!features.hasOwnProperty(featureId)) {
			continue;
		}
		// While we are in the server side, we need to check if the feature is supported.
		if (!featuresStack.hasOwnProperty(featureId)) {
			continue;
		}

		const standardFeature = {
			name: featureId,
			isEnabled: featuresStack[featureId].isEnabled,
			boot: featuresStack[featureId].boot,
		};

		dispatch(STORE_NAME).registerFeature(standardFeature);
	}
};

export * from './use-block-features';
