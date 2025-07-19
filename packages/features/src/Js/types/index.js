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

export type TEditBlockHTMLArgs = {
	name: string,
	clientId: string,
	blockRefId: { current: HTMLElement },
	attributes: Object,
};

export type TBlockFeaturesParams = {
	hasSideEffect: boolean,
	hasContextualToolbar: {
		enabled: boolean,
		type: 'button' | 'dropdown' | 'none',
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

export type TBlockFeatures = {
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
	blockRefId: { current: HTMLElement },
	blockFeatures?: TBlockFeaturesParams,
};

export type TUseBlockStyleEngineProps = {
	settings: StylesProps,
};
