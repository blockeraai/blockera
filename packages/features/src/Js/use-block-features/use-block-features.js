// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';
import { featuresConfig } from './index';

export const useBlockFeatures = (props: {
	name: string,
	clientId: string,
	attributes: Object,
	blockRefId: { current: HTMLElement },
}) => {
	const { getFeatures } = select(STORE_NAME);
	const registeredFeatures = getFeatures();

	useEffect(() => {
		for (const featureId in registeredFeatures) {
			const feature = registeredFeatures[featureId];
			const featureConfig = featuresConfig[featureId];

			// If the feature is not registered, skip it.
			if (!featuresConfig[featureId]) {
				continue;
			}
			// Check the feature available in feature blocks configuration.
			if (!Object.keys(featureConfig.blocks).includes(props.name)) {
				continue;
			}
			// If feature has not boot function, skip it.
			if ('function' !== typeof feature.boot) {
				continue;
			}
			// If feature has not isEnabled function, skip it.
			if ('function' !== typeof feature.isEnabled) {
				continue;
			}
			// Skip if the feature is not enabled based on isEnabled() return value.
			if (feature.isEnabled()) {
				feature.boot(props);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);
};
