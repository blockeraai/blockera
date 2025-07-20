// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import type { CssRule } from '@blockera/editor/js/style-engine/types';
import type { StylesProps } from '@blockera/editor/js/extensions/libs/types';

/**
 * Internal dependencies
 */
import type { TFeatureId } from './library';

type TFeatureHTMLEditable = {
	status: boolean,
	selector: string,
};

type TFeatureContextualToolbar = {
	status: boolean,
	type: 'button' | 'dropdown' | 'none',
};

export type TEditBlockHTMLArgs = {
	name: string,
	clientId: string,
	attributes: Object,
	featureConfig: TFeatureHTMLEditable,
	blockRefId: { current: HTMLElement },
};

export type TBlockFeatures = {
	[key: TFeatureId]: {
		htmlEditable?: TFeatureHTMLEditable,
		contextualToolbar?: TFeatureContextualToolbar,
	},
};

export type TFeature = {
	name: string,
	isEnabled: () => boolean,
	toolbarControls?: TToolbarControls,
	ToolbarButtonComponent?: ComponentType<any>,
	editBlockHTML?: (args: TEditBlockHTMLArgs) => void,
	styleGenerator?: (args: StylesProps) => Array<CssRule>,
};

export type TToolbarControls = Array<{
	title: string,
	onClick: () => void,
}>;

export type TBlockFeaturesHookValue = {
	ContextualToolbarComponents: TContextualToolbarComponents,
};

export type TContextualToolbarComponents = ComponentType<{
	isDropDownMenu?: boolean,
}>;

export type TCalculatedFeatures = {
	blockSideEffectFeatures: Array<TFeature>,
	contextualToolbarFeatures: Array<TFeature>,
};

export type TUseBlockFeaturesProps = {
	name: string,
	clientId: string,
	attributes: Object,
	blockFeatures?: TBlockFeatures,
	blockRefId: { current: HTMLElement },
};

export type TUseBlockStyleEngineProps = {
	settings: StylesProps,
};
