// @flow

import type { ComponentType } from 'react';

export type TEditBlockHTMLArgs = {
	name: string,
	clientId: string,
	blockRefId: { current: HTMLElement },
	attributes: Object,
};

export type TFeature = {
	name: string,
	isEnabled: () => boolean,
	toolbarControls?: TToolbarControls,
	ToolbarButtonComponent?: ComponentType<any>,
	editBlockHTML?: (args: TEditBlockHTMLArgs) => void,
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
