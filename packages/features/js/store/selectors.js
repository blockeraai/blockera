// @flow

/**
 * Internal dependencies
 */
import type { TFeature } from '../types';

export const getFeature = (state: Object, featureId: string): TFeature => {
	return state.features[featureId];
};

export const getFeatures = (state: Object): Object => {
	return state.features;
};
