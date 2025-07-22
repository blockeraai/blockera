// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';

export type TContextualToolbarComponents = ComponentType<{
	isDropDownMenu?: boolean,
}>;

export type TCalculatedFeatures = {
	blockSideEffectFeatures: Array<TFeature>,
	contextualToolbarFeatures: Array<TFeature>,
};

export type TBlockFeaturesHookValue = {
	ContextualToolbarComponents: TContextualToolbarComponents,
};

export type TUseBlockFeaturesProps = {
	name: string,
	clientId: string,
	attributes: Object,
	blockFeatures?: TBlockFeatures,
};
