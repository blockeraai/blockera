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
	},
	extensionConfig: {
		blockeraDisplay: FeatureConfig,
		blockeraFlexLayout: FeatureConfig,
		blockeraGap: FeatureConfig,
		blockeraFlexWrap: FeatureConfig,
		blockeraAlignContent: FeatureConfig,
	},
	extensionProps: {
		blockeraDisplay: Object,
		blockeraFlexLayout: Object,
		blockeraGap: Object,
		blockeraFlexWrap: Object,
		blockeraAlignContent: Object,
	},
};
