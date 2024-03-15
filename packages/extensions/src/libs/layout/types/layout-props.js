// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TCssProps = {
	display?: string,
	'flex-direction'?: string,
	'align-items'?: string,
	'justify-content'?: string,
	'row-gap'?: string,
	gap?: string,
	'column-gap'?: string,
	'flex-wrap'?: string,
	'align-content'?: string,
	'justify-items'?: string,
	'grid-auto-flow'?: string,
};

export type DisplayType =
	| 'none'
	| 'flex'
	| 'block'
	| 'inline'
	| 'inline-block'
	| 'grid';

export type TLayoutProps = {
	...BaseExtensionProps,
	values: {
		publisherDisplay: DisplayType,
		publisherFlexLayout: {
			direction: 'row' | 'column',
			alignItems: string,
			justifyContent: string,
		},
		publisherGap: {
			lock: boolean,
			gap: string,
			columns: string,
			rows: string,
		},
		publisherFlexWrap: { value: string, reverse: boolean },
		publisherAlignContent: string,
		publisherGridAlignItems: string,
		publisherGridJustifyItems: string,
		publisherGridAlignContent: string,
		publisherGridJustifyContent: string,
		publisherGridGap: {
			lock: boolean,
			gap: string,
			columns: string,
			rows: string,
		},
		publisherGridDirection: { value: string, dense: boolean },
		publisherGridColumns: Array<Object>,
		publisherGridRows: Array<Object>,
		publisherGridAreas: Array<Object>,
	},
	extensionConfig: {
		publisherDisplay: FeatureConfig,
		publisherFlexLayout: FeatureConfig,
		publisherGap: FeatureConfig,
		publisherFlexWrap: FeatureConfig,
		publisherAlignContent: FeatureConfig,
		publisherGridAlignItems: FeatureConfig,
		publisherGridJustifyItems: FeatureConfig,
		publisherGridAlignContent: FeatureConfig,
		publisherGridJustifyContent: FeatureConfig,
		publisherGridGap: FeatureConfig,
		publisherGridDirection: FeatureConfig,
		publisherGridColumns: FeatureConfig,
		publisherGridRows: FeatureConfig,
		publisherGridAreas: FeatureConfig,
	},
	extensionProps: {
		publisherDisplay: Object,
		publisherFlexLayout: Object,
		publisherGap: Object,
		publisherFlexWrap: Object,
		publisherAlignContent: Object,
		publisherGridAlignItems: Object,
		publisherGridJustifyItems: Object,
		publisherGridAlignContent: Object,
		publisherGridJustifyContent: Object,
		publisherGridGap: Object,
		publisherGridDirection: Object,
		publisherGridColumns: Object,
		publisherGridRows: Object,
		publisherGridAreas: Object,
	},
};
