// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';

/**
 * Internal dependencies
 */
import type { TFeature, TBlockFeatures } from './feature';

export type TContextualToolbarComponents = ComponentType<{
	isDropDownMenu?: boolean,
}>;

export type TCalculatedFeatures = {
	blockSideEffectFeatures: Array<TFeature>,
	contextualToolbarFeatures: Array<TFeature>,
	mappedFeatureUIComponents: Array<ComponentType<any>>,
};

export type TBlockFeaturesHookValue = {
	ContextualToolbarComponents: TContextualToolbarComponents,
	BlockFeaturesInlineStyles: ComponentType<{
		clientId: string,
		className: string,
		currentAttributes: Object,
	}>,
};

export type TUseBlockFeaturesProps = {
	name: string,
	clientId: string,
	attributes: Object,
	blockFeatures?: TBlockFeatures,
	getBlockCSSSelector?: (
		blockType: Object,
		target: Array<string> | string,
		options: { fallback?: boolean }
	) => ?string,
};
