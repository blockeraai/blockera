// @flow

/**
 * Internal dependencies
 */
import type { TFeature } from '../types';

export const registerFeature = (feature: TFeature): Object => {
	return {
		type: 'REGISTER_FEATURE',
		payload: feature,
		featureId: feature.name,
	};
};
