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

type TFeatureId = 'icon';

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
		status: boolean,
		items: {
			[key: string]: InnerBlocks,
		},
	},
	blockStates: {
		status: boolean,
		items: {
			[key: string]: StateTypes,
		},
	},
};

export type TBlockFeatures = {
	[key: TFeatureId]: {
		inspector: TFeatureInspector,
		htmlEditable: THtmlEditable,
		contextualToolbar: TFeatureContextualToolbar,
	},
};

export type TToolbarControls = Array<{
	title: string,
	onClick: () => void,
}>;

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
