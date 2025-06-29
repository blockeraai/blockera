// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';

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

			if ('function' !== typeof feature.boot) {
				continue;
			}

			if ('function' !== typeof feature.isEnabled) {
				continue;
			}

			if (feature.isEnabled()) {
				feature.boot(props);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);
};
