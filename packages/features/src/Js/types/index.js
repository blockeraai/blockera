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
import type { StateTypes } from '@blockera/editor/js/extensions/libs/block-card/block-states/types';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/block-card/inner-blocks/types';

/**
 * Internal dependencies
 */
import type { TFeatureId } from './library';

type THtmlEditable = {
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
	htmlEditable: THtmlEditable,
	blockRefId: { current: HTMLElement },
};

type TFeatureInspector = {
	status: boolean,
	extensions: {
		icon: {
			tabPosition:
				| 'blockera-inspector-settings-start'
				| 'blockera-inspector-settings-end'
				| 'blockera-inspector-settings'
				| 'blockera-inspector-styles-start'
				| 'blockera-inspector-styles-end'
				| 'blockera-inspector-styles'
				| 'blockera-inspector-interactions-start'
				| 'blockera-inspector-interactions'
				| 'blockera-inspector-interactions-end',
		},
	},
	innerBlocks: {
		[key: string]: InnerBlocks,
	},
	blockStates: {
		[key: string]: StateTypes,
	},
};

export type TBlockFeatures = {
	[key: TFeatureId]: {
		inspector: TFeatureInspector,
		htmlEditable: THtmlEditable,
		contextualToolbar: TFeatureContextualToolbar,
	},
};

export type TFeature = {
	name: string,
	isEnabled: () => boolean,
	extensionConfigId: string,
	toolbarControls?: TToolbarControls,
	ExtensionComponent: ComponentType<any>,
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

export type TExtensionSlotFillProps = {
	block: Object,
	settings: Object,
	slotName: string,
	attributes: Object,
	additional: Object,
	currentStateAttributes: Object,
	handleOnChangeSettings: (newSupports: Object, name: string) => void,
	handleOnChangeAttributes: (attributes: Object, ref: Object) => void,
};

export type TExtensionFillComponentProps = ComponentType<{
	block: Object,
	settings: Object,
	attributes: Object,
	currentStateAttributes: Object,
	handleOnChangeSettings: (newSupports: Object, name: string) => void,
	handleOnChangeAttributes: (attributes: Object, ref: Object) => void,
}>;
