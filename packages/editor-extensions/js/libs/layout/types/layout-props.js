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
		blockeraDisplay: DisplayType,
		blockeraFlexLayout: {
			direction: 'row' | 'column',
			alignItems: string,
			justifyContent: string,
		},
		blockeraGap: {
			lock: boolean,
			gap: string,
			columns: string,
			rows: string,
		},
		blockeraFlexWrap: { value: string, reverse: boolean },
		blockeraAlignContent: string,
		blockeraGridAlignItems: string,
		blockeraGridJustifyItems: string,
		blockeraGridAlignContent: string,
		blockeraGridJustifyContent: string,
		blockeraGridGap: {
			lock: boolean,
			gap: string,
			columns: string,
			rows: string,
		},
		blockeraGridDirection: { value: string, dense: boolean },
		blockeraGridColumns: Array<Object>,
		blockeraGridRows: Array<Object>,
		blockeraGridAreas: Array<Object>,
	},
	extensionConfig: {
		blockeraDisplay: FeatureConfig,
		blockeraFlexLayout: FeatureConfig,
		blockeraGap: FeatureConfig,
		blockeraFlexWrap: FeatureConfig,
		blockeraAlignContent: FeatureConfig,
		blockeraGridAlignItems: FeatureConfig,
		blockeraGridJustifyItems: FeatureConfig,
		blockeraGridAlignContent: FeatureConfig,
		blockeraGridJustifyContent: FeatureConfig,
		blockeraGridGap: FeatureConfig,
		blockeraGridDirection: FeatureConfig,
		blockeraGridColumns: FeatureConfig,
		blockeraGridRows: FeatureConfig,
		blockeraGridAreas: FeatureConfig,
	},
	extensionProps: {
		blockeraDisplay: Object,
		blockeraFlexLayout: Object,
		blockeraGap: Object,
		blockeraFlexWrap: Object,
		blockeraAlignContent: Object,
		blockeraGridAlignItems: Object,
		blockeraGridJustifyItems: Object,
		blockeraGridAlignContent: Object,
		blockeraGridJustifyContent: Object,
		blockeraGridGap: Object,
		blockeraGridDirection: Object,
		blockeraGridColumns: Object,
		blockeraGridRows: Object,
		blockeraGridAreas: Object,
	},
};
