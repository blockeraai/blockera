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
	},
	extensionConfig: {
		publisherDisplay: FeatureConfig,
		publisherFlexLayout: FeatureConfig,
		publisherGap: FeatureConfig,
		publisherFlexWrap: FeatureConfig,
		publisherAlignContent: FeatureConfig,
	},
	extensionProps: {
		publisherDisplay: Object,
		publisherFlexLayout: Object,
		publisherGap: Object,
		publisherFlexWrap: Object,
		publisherAlignContent: Object,
	},
};
